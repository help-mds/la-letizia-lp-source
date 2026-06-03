ALTER TABLE `leads` ADD `ambiance_density` varchar(50);--> statement-breakpoint
ALTER TABLE `leads` ADD `ambiance_texture_emphasis` varchar(50);--> statement-breakpoint
ALTER TABLE `leads` ADD `ambiance_accent_color` varchar(20);--> statement-breakpoint
ALTER TABLE `leads` ADD `frame_urls_landscape` json;--> statement-breakpoint
ALTER TABLE `leads` ADD `frame_urls_portrait` json;