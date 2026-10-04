CREATE TABLE `repairs` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`phone` text NOT NULL,
	`laptop` text NOT NULL,
	`serial` text NOT NULL,
	`complaint` text NOT NULL,
	`damage` text NOT NULL,
	`service` text NOT NULL,
	`status` text NOT NULL,
	`cost` integer NOT NULL,
	`paid` integer NOT NULL,
	`received` text NOT NULL,
	`notes` text NOT NULL,
	`updated` text NOT NULL
);
