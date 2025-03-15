export const cartId = "shopping_cart";

export default class shoppingCart {
	public items: Item[];
	public total: number;

	constructor() {
		this.items = JSON.parse(sessionStorage.getItem(cartId) || "[]") || [];
		this.total = 0;
	}

	add(item: Item): void {
		const subItem = this.items.find((sub) => sub.id === item.id);
		if (subItem?.quantity) subItem.quantity++;
		else {
			item.quantity = 1;
			this.items.push(item);
		}

		this.save();
	}

	update(id: number, quantity: number): void {
		const subItem = this.items.find((sub) => sub.id === id);
		if (subItem) {
			if (quantity <= 0) {
				this.remove(id);
				return;
			}
			subItem.quantity = quantity;
		}
		this.save();
	}

	updateTotal(): void {
		this.total = this.items.reduce(
			(sum, current) => sum + current.price * (current.quantity ?? 1),
			0,
		);
	}

	remove(id: number): void {
		this.items.filter((item) => item.id !== id);
		this.save();
	}

	clear(): void {
		this.items = [];
		this.total = 0;
		sessionStorage.clear();
	}

	save(): void {
		this.updateTotal();
		sessionStorage.setItem(cartId, JSON.stringify(this.items));
		const event = new Event("addCart");
		dispatchEvent(event);
	}
}
