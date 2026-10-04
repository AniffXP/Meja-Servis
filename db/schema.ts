import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const repairs = sqliteTable('repairs', {
 id: text('id').primaryKey(), customer: text('customer').notNull(), phone: text('phone').notNull(),
 laptop: text('laptop').notNull(), serial: text('serial').notNull(), complaint: text('complaint').notNull(),
 damage: text('damage').notNull(), service: text('service').notNull(), status: text('status').notNull(),
 cost: integer('cost').notNull(), paid: integer('paid').notNull(), received: text('received').notNull(),
 notes: text('notes').notNull(), updated: text('updated').notNull()
});
