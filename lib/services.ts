export type Service = {id:string; name:string; category:string; description:string; price:number; active:boolean; updated:string};
export type ServiceLine = {name:string; quantity:number; price:number};
export const categories = ['Pemeriksaan', 'Perawatan', 'Software', 'Hardware', 'Upgrade', 'Lainnya'];
export const serviceSuggestions = [
 {name:'Diagnosis laptop',category:'Pemeriksaan',description:'Pemeriksaan kendala dan diagnosis kerusakan.'},
 {name:'Cleaning & ganti thermal paste',category:'Perawatan',description:'Pembersihan kipas dan penggantian thermal paste.'},
 {name:'Instal ulang sistem operasi',category:'Software',description:'Instalasi sistem operasi dan driver. Konfirmasi pencadangan data serta lisensi terlebih dahulu.'},
 {name:'Penggantian keyboard',category:'Hardware',description:'Penggantian keyboard sesuai model laptop.'},
 {name:'Penggantian layar',category:'Hardware',description:'Penggantian panel layar sesuai tipe laptop.'},
 {name:'Upgrade SSD / RAM',category:'Upgrade',description:'Pemasangan komponen sesuai kompatibilitas laptop.'},
];
export function rupiah(value:unknown):number {
 if(typeof value!=='number'||!Number.isSafeInteger(value)||value<0||value>1000000000)throw Error('Harga harus berupa rupiah bulat antara 0 dan 1 miliar.');
 return value;
}
export function validateService(value:unknown):Omit<Service,'updated'> {
 if(!value||typeof value!=='object')throw Error('Layanan tidak valid.');
 const v=value as Record<string,unknown>;
 for(const k of ['id','name','category','description'])if(typeof v[k]!=='string'||v[k].length>2000)throw Error('Isian layanan tidak valid.');
 if(!/^[a-zA-Z0-9-]{8,64}$/.test(v.id as string))throw Error('ID layanan tidak valid.');
 const name=(v.name as string).trim();
 if(!name||name.length>200)throw Error('Nama layanan wajib diisi, maksimal 200 karakter.');
 if(!categories.includes(v.category as string))throw Error('Kategori tidak valid.');
 if(typeof v.active!=='boolean')throw Error('Status layanan tidak valid.');
 return {id:v.id as string,name,category:v.category as string,description:(v.description as string).trim(),price:rupiah(v.price),active:v.active};
}
export function validateLines(value:unknown):ServiceLine[] {
 if(!Array.isArray(value)||value.length>50)throw Error('Maksimal 50 rincian pekerjaan.');
 return value.map(line=>{
  if(!line||typeof line!=='object'||typeof line.name!=='string'||!line.name.trim()||line.name.length>200)throw Error('Nama pekerjaan wajib diisi, maksimal 200 karakter.');
  if(!Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>100)throw Error('Jumlah pekerjaan harus 1–100.');
  return {name:line.name.trim(),quantity:line.quantity,price:rupiah(line.price)};
 });
}
export function totalLines(lines:ServiceLine[]){return lines.reduce((sum,l)=>sum+l.quantity*l.price,0);}
