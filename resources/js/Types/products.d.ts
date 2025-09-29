declare interface Item<T = unknown> {
	id: number | string;
	name: string;
	images: ProductImage[];
	default_image?: ProductImage;
	product_inventory?: ProductInventory;
	brand?: ProductBrand;
	category?: ProductCategory;
	barcode: string;
	description: string;
	price: number;
	quantity?: number;
	data?: T;
}

declare interface ProductBrand {
	id: number;
	name: string;
	created_by: User;
}

declare interface ProductInventory {
	id: number;
	product_id: number;
	stock: number;
}

declare interface ProductImage {
	id: number;
	default: boolean;
	image: string;
}

declare interface ProductCategory {
	id: number;
	name: string;
	created_by: User;
}

declare interface MovementItem {
	id: number;
	quantity: number;
	type: 'ingress' | 'egress';
	model_type: string;
	model_id: number;
	user_id: number;
	controller_name: string;
	created_at: string;
	product_inventory: {
		product: {
			name: string;
			barcode?: string;
		};
	};
	user: {
		name: string;
	};
}