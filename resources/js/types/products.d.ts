declare interface Item<T = unknown> {
	id: number;
	name: string;
	image: string;
	barcode: number;
	description: string;
	price: number;
	quantity?: number;
	data?: T;
}
