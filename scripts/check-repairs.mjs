import assert from 'node:assert/strict';
const base='http://127.0.0.1:8787';
const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/Meja kerja servis/);
const item={id:'test-repair-0001',customer:'Klien Uji',phone:'08123456789',laptop:'Laptop Uji',serial:'TEST',complaint:'Tidak menyala',damage:'DC jack',service:'Ganti DC jack',status:'Diterima',cost:350000,paid:100000,received:'2026-10-04',notes:'Hanya data uji lokal'};
async function save(body){return fetch(base+'/api/repairs',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify(body)});}
assert.equal((await save(item)).status,200);
let rows=await (await fetch(base+'/api/repairs')).json();assert.equal(rows.find(x=>x.id===item.id).paid,100000);
assert.equal((await save({...item,status:'Siap diambil',paid:350000})).status,200);
rows=await (await fetch(base+'/api/repairs')).json();assert.equal(rows.filter(x=>x.id===item.id).length,1);assert.equal(rows.find(x=>x.id===item.id).status,'Siap diambil');
for(const bad of [{paid:400000},{cost:-1},{customer:''},{status:'Invalid'},{cost:1.5}])assert.equal((await save({...item,...bad})).status,400);
const blocked=await fetch(base+'/api/repairs',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://example.org'},body:JSON.stringify(item)});assert.equal(blocked.status,403);
console.log('PASS: page render, create, read-back, update, no duplicate, invalid payments/status/name, cross-origin rejection.');
