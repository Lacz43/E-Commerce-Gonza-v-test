declare interface Item<T = unknown> {
	id: number | string;
	name: string;
	images: string[{ id: number; image: string }];
	default_image?: { id: number; image: string };
	product_inventory?: { id: number; product_id: number; stock: number };
	barcode: string;
	description: string;
	price: number;
	quantity?: number;
	data?: T;
}
