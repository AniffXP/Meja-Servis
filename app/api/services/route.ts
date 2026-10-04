import { database } from '../../../lib/db';
import { validateService } from '../../../lib/services';
export async function GET(){
 try{const data=await database().prepare('SELECT * FROM services ORDER BY active DESC, name COLLATE NOCASE').all();return Response.json(data.results.map(s=>({...s,active:!!s.active})),{headers:{'Cache-Control':'no-store'}});}
 catch(e){console.error(e);return Response.json({error:'Daftar layanan belum dapat dimuat. Coba lagi.'},{status:503});}
}
export async function POST(request:Request){
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Permintaan tidak diizinkan.'},{status:403});
 let s;
 try{s=validateService(await request.json());}catch(e){return Response.json({error:e instanceof Error?e.message:'Data tidak valid.'},{status:400});}
 try{const updated=new Date().toISOString();await database().prepare('INSERT INTO services (id,name,category,description,price,active,updated) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,category=excluded.category,description=excluded.description,price=excluded.price,active=excluded.active,updated=excluded.updated').bind(s.id,s.name,s.category,s.description,s.price,s.active?1:0,updated).run();return Response.json({...s,updated});}
 catch(e){console.error(e);return Response.json({error:'Layanan gagal disimpan. Isian tetap tersedia; coba lagi.'},{status:503});}
}
