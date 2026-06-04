ALTER TABLE `leads` ADD `luxury_tier` enum('luxury','casual') DEFAULT 'luxury';--> statement-breakpoint
ALTER TABLE `leads` ADD `line_url` text;