export const cartId = "shopping_cart";

// clase para manejar el carrito
export default class shoppingCart {
	// items en el carrito
	// total de la orden
	public items: Item[];
	public total: number;

	// constructor
	constructor() {
		this.items = JSON.parse(sessionStorage.getItem(cartId) || "[]") || [];
		this.total = 0;
	}

	// add: agrega un item al carrito
	add(item: Item): void {
		const subItem = this.items.find((sub) => sub.id === item.id);
		if (subItem?.quantity) subItem.quantity++;
		else {
			item.quantity = 1;
			this.items.push(item);
		}

		this.save();
	}

	// update: actualiza la cantidad de un item en el carrito
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

	// updateTotal: actualiza el total de la orden
	updateTotal(): void {
		this.total = this.items.reduce(
			(sum, current) => sum + current.price * (current.quantity ?? 1),
			0,
		);
	}

	// remove: elimina un item del carrito
	remove(id: number): void {
		this.items.filter((item) => item.id !== id);
		this.save();
	}

	// clear: elimina todos los items del carrito
	clear(): void {
		this.items = [];
		this.total = 0;
		sessionStorage.clear();
		const event = new Event("addCart"); // evento para actualizar el carrito
		dispatchEvent(event);
	}

	// save: guarda el carrito en el storage
	save(): void {
		this.updateTotal();
		sessionStorage.setItem(cartId, JSON.stringify(this.items));
		const event = new Event("addCart"); // evento para actualizar el carrito
		dispatchEvent(event);
	}
}
