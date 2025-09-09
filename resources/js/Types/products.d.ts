declare interface Item<T = unknown> {
	id: number | string;
	name: string;
	images: Image[];
	default_image?: Image;
	product_inventory?: ProductInventory;
	brand?: Brand;
	barcode: string;
	description: string;
	price: number;
	quantity?: number;
	data?: T;
}

declare interface Brand {
	id: number;
	name: string;
	created_by: User;
}

declare interface ProductInventory {
	id: number;
	product_id: number;
	stock: number;
}

declare interface Image {
	id: number;
	image: string;
}