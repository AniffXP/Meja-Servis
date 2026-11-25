import { spawn } from 'node:child_process';
import { mkdirSync, openSync, closeSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const url='http://127.0.0.1:8787';
process.chdir(root);
async function ready(){
 try {
  const response=await fetch(url,{signal:AbortSignal.timeout(1500)});
  if(!response.ok)return false;
  const html=await response.text();
  if(!html.includes('Meja Servis')&&!html.includes('MejaServis'))throw Error('Port 8787 dipakai aplikasi lain.');
  const data=await fetch(url+'/api/repairs',{signal:AbortSignal.timeout(3000)});
  if(!data.ok)return false;
  return Array.isArray(await data.json());
 }catch(e){if(e.message==='Port 8787 dipakai aplikasi lain.')throw e;return false;}
}
try {
 if(!await ready()){
  if(!existsSync('dist/server/wrangler.json')||!existsSync('node_modules/wrangler/bin/wrangler.js'))throw Error('File aplikasi belum siap. Buka folder proyek dan jalankan instalasi serta build terlebih dahulu.');
  mkdirSync('.sites-runtime',{recursive:true});
  const out=openSync('.sites-runtime/local-server.log','a');
  const err=openSync('.sites-runtime/local-server-error.log','a');
  const child=spawn(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','8787','--inspector-port','0'],{cwd:root,detached:true,windowsHide:true,stdio:['ignore',out,err]});
  await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject)});
  writeFileSync('.sites-runtime/local-server.json',JSON.stringify({pid:child.pid,url,root}));
  child.unref();closeSync(out);closeSync(err);
  console.log('Menyiapkan Meja Servis...');
  let up=false;
  for(let i=0;i<45;i++){if(await ready()){up=true;break;}await new Promise(r=>setTimeout(r,1000));}
  if(!up)throw Error('Aplikasi belum siap. Lihat .sites-runtime/local-server-error.log untuk detail.');
 }
 console.log('Meja Servis siap: '+url);
 if(!process.argv.includes('--no-open')){
  const browser=spawn('powershell.exe',['-NoProfile','-Command',"Start-Process 'http://127.0.0.1:8787'"],{windowsHide:true,stdio:'ignore'});
  await new Promise((resolve,reject)=>{browser.once('error',reject);browser.once('exit',code=>code===0?resolve():reject(Error('Buka browser ke '+url)))});
 }
}catch(e){console.error(e.message);process.exitCode=1;}
