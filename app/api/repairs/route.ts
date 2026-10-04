import { database } from '../../../lib/db';
import { validateRepair } from '../../../lib/repairs';
export async function GET() {
 try { const data = await database().prepare('SELECT * FROM repairs ORDER BY received DESC, updated DESC').all(); return Response.json(data.results, {headers:{'Cache-Control':'no-store'}}); }
 catch (e) { console.error(e); return Response.json({error:'Catatan belum dapat dimuat. Silakan coba lagi.'},{status:503}); }
}
export async function POST(request: Request) {
 if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'Permintaan tidak diizinkan.'},{status:403});
 let item;
 try { item = validateRepair(await request.json()); } catch(e) { return Response.json({error:e instanceof Error ? e.message : 'Data tidak valid.'},{status:400}); }
 try {
  const updated = new Date().toISOString();
  await database().prepare(`INSERT INTO repairs (id,customer,phone,laptop,serial,complaint,damage,service,status,cost,paid,received,notes,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET customer=excluded.customer,phone=excluded.phone,laptop=excluded.laptop,serial=excluded.serial,complaint=excluded.complaint,damage=excluded.damage,service=excluded.service,status=excluded.status,cost=excluded.cost,paid=excluded.paid,received=excluded.received,notes=excluded.notes,updated=excluded.updated`).bind(item.id,item.customer,item.phone,item.laptop,item.serial,item.complaint,item.damage,item.service,item.status,item.cost,item.paid,item.received,item.notes,updated).run();
  return Response.json({...item,updated});
 } catch(e) { console.error(e); return Response.json({error:'Penyimpanan gagal. Isianmu tetap tersedia; coba simpan lagi.'},{status:503}); }
}
