declare interface Order {
	id: number;
	user_id: number | null;
	status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
	created_at: string;
	updated_at: string;
	user?: User;
	orderItems?: OrderItem[];
}

declare interface OrderItem {
	id: number;
	order_id: number;
	product_id: number;
	quantity: number;
	price: number;
	product?: Item;
}
