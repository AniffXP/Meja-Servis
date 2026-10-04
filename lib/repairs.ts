export const statuses = ['Diterima', 'Diagnosis', 'Menunggu persetujuan', 'Dikerjakan', 'Siap diambil', 'Selesai', 'Dibatalkan'] as const;
export type Repair = { id: string; customer: string; phone: string; laptop: string; serial: string; complaint: string; damage: string; service: string; status: string; cost: number; paid: number; received: string; notes: string; updated: string };
export function validateRepair(value: unknown): Omit<Repair, 'updated'> {
 if (!value || typeof value !== 'object') throw Error('Data tidak valid.');
 const v = value as Record<string, unknown>;
 const result: Record<string, unknown> = {};
 for (const key of ['id','customer','phone','laptop','serial','complaint','damage','service','status','received','notes']) {
  if (typeof v[key] !== 'string' || v[key].length > 5000) throw Error('Isian tidak valid: ' + key);
  result[key] = v[key].trim();
 }
 for (const key of ['customer','laptop','complaint']) if (!result[key]) throw Error('Nama klien, laptop, dan keluhan wajib diisi.');
 if (!/^[a-zA-Z0-9-]{8,64}$/.test(String(result.id))) throw Error('Nomor servis tidak valid.');
 if (!statuses.includes(result.status as typeof statuses[number])) throw Error('Status tidak valid.');
 if (!/^\d{4}-\d{2}-\d{2}$/.test(String(result.received)) || !Number.isFinite(Date.parse(String(result.received)))) throw Error('Tanggal tidak valid.');
 for (const key of ['cost','paid']) {
  if (!Number.isSafeInteger(v[key]) || Number(v[key]) < 0 || Number(v[key]) > 1000000000) throw Error('Biaya harus berupa rupiah bulat antara 0 dan 1 miliar.');
  result[key] = v[key];
 }
 if (Number(result.paid) > Number(result.cost)) throw Error('Pembayaran tidak boleh melebihi total biaya.');
 return result as Omit<Repair, 'updated'>;
}
