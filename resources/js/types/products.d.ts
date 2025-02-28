declare interface Item<T = unknown> {
	id: number;
	name: string;
	image: string;
	description: string;
	price: number;
	data?: T;
}
