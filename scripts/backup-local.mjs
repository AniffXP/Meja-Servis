import { DatabaseSync, backup } from 'node:sqlite';
import { readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const folder=path.join(root,'.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
const candidates=readdirSync(folder).filter(f=>f.endsWith('.sqlite')&&f!=='metadata.sqlite');
let found=false;
for(const file of candidates){
 const db=new DatabaseSync(path.join(folder,file),{readOnly:true});
 try{
  if(!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='repairs'").get())continue;
  mkdirSync(path.join(root,'backups'),{recursive:true});
  const target=path.join(root,'backups',`mejaservis-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);
  await backup(db,target);console.log('Cadangan tersimpan: '+target);found=true;
 }finally{db.close();}
}
if(!found)throw Error('Database catatan servis belum ditemukan.');
