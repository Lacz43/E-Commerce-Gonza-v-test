declare interface Item<T = unknown> {
	id: number | string;
	name: string;
	image: string;
	barcode: string;
	description: string;
	price: number;
	quantity?: number;
	data?: T;
}
