import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync } from 'node:fs';
const base='http://127.0.0.1:8787';
const serviceId=crypto.randomUUID(),repairId=crypto.randomUUID();
async function post(route,body){return fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(body)});}
const service={id:serviceId,name:'Pengujian layanan sementara',category:'Hardware',description:'Data uji otomatis',price:150000,active:true};
const repair={id:repairId,customer:'Pengujian sementara',phone:'',laptop:'Laptop pengujian',serial:'',complaint:'Keyboard tidak merespons',damage:'Keyboard rusak',service:'Ganti keyboard dan pembersihan',status:'Dikerjakan',cost:1,paid:100000,received:'2026-10-04',notes:'Data uji otomatis',lines:[{name:service.name,quantity:1,price:150000},{name:'Pembersihan',quantity:2,price:50000}]};
try{
 assert.equal((await fetch(base)).status,200);
 assert.equal((await post('/api/services',service)).status,200);
 let services=await(await fetch(base+'/api/services')).json();assert.equal(services.find(s=>s.id===serviceId).active,true);
 for(const bad of [{price:-1},{price:0.5},{name:' '},{active:'yes'},{category:'Invalid'}])assert.equal((await post('/api/services',{...service,...bad})).status,400);
 const saved=await post('/api/repairs',repair);assert.equal(saved.status,200);assert.equal((await saved.json()).cost,250000,'Server must calculate total from lines, ignoring supplied total');
 assert.equal((await post('/api/services',{...service,price:900000,active:false})).status,200);
 services=await(await fetch(base+'/api/services')).json();assert.equal(services.find(s=>s.id===serviceId).active,false);
 let rows=await(await fetch(base+'/api/repairs')).json();let current=rows.find(r=>r.id===repairId);assert.equal(current.lines[0].price,150000,'Catalog edit must not change old repair price');assert.equal(current.cost,250000);assert.equal(current.damage,repair.damage);assert.equal(current.complaint,repair.complaint);
 for(const lines of [[{name:'',quantity:1,price:100}], [{name:'Test',quantity:0,price:1}], [{name:'Test',quantity:1.5,price:1}], [{name:'Test',quantity:100,price:1000000000}]])assert.equal((await post('/api/repairs',{...repair,lines})).status,400);
 assert.equal((await post('/api/repairs',{...repair,paid:250001})).status,400);
 assert.equal((await post('/api/repairs',{...repair,lines:[],cost:200000,paid:50000})).status,200);
 rows=await(await fetch(base+'/api/repairs')).json();current=rows.find(r=>r.id===repairId);assert.equal(current.cost,200000);assert.deepEqual(current.lines,[]);assert.equal(rows.filter(r=>r.id===repairId).length,1);
 console.log('PASS: service create/edit/deactivate, required fields, itemized totals, stable historical prices, payment validation, legacy manual costs, repair read-back.');
}finally{
 // Remove only this run's random test IDs from the local database.
 const folder='.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
 for(const f of readdirSync(folder).filter(f=>f.endsWith('.sqlite')&&f!=='metadata.sqlite')){
  const db=new DatabaseSync(folder+'/'+f);
  try{if(db.prepare("SELECT name FROM sqlite_master WHERE name='services'").get()){db.prepare('DELETE FROM repairs WHERE id=?').run(repairId);db.prepare('DELETE FROM services WHERE id=?').run(serviceId);}}finally{db.close();}
 }
}
