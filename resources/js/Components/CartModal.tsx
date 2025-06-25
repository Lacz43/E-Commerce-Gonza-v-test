import ModalStyled from "@/Components/Modals/ModalStyled";
import ProductsInCar from "@/Components/ProductsInCar";
import { ShoppingCart, WhatsApp } from "@mui/icons-material";
import Button from "@mui/material/Button";
import shoppingCart from "@/shoppingCart";
import { useEffect, useState } from "react";

export default function CartModal({
	show,
	setOpen,
}: {
	show: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [items, setItems] = useState<Item[]>([]);

	function emtyCart() {
		const cart = new shoppingCart();
		cart.clear();
		setItems([]);
	}

	useEffect(() => {
		if (show) {
			const cart = new shoppingCart();
			setItems(cart.items);
		}
	}, [show]);

	useEffect(() => {
		addEventListener("addCart", () => {
			const cart = new shoppingCart();
			setItems(cart.items);
		});
		return () => removeEventListener("addCart", () => {});
	}, []);

	function sendMessage() {
		// mover a otro componente

		// construir el mensaje para enviar por whatsapp
		let url = `https://wa.me/${import.meta.env.VITE_COMPANY_PHONE}`;

		const cart = new shoppingCart();
		let message = "";

		for (const item of cart.items) {
			message += `${item.name} \t${item.quantity}\n`;
		}

		url += `?text=${encodeURI(message)}`;
		window.open(url);
	}

	return (
		<ModalStyled
			show={show}
			onClose={() => setOpen(false)}
			maxWidth="2xl"
			header={
				<>
					<h2 className="font-bold">Carrito</h2>
					<span>
						{items
							.reduce(
								(prev, curr) => curr.price * (curr.quantity ?? 1) + prev,
								0,
							)
							.toFixed(2)}{" "}
						$
					</span>
				</>
			}
			body={items.map((it) => <ProductsInCar item={it} key={it.id} />)}
			footer={
				<>
					<Button
						size="medium"
						color="info"
						variant="contained"
						endIcon={<WhatsApp />}
						onClick={() => sendMessage()}
						className="w-full md:w-auto"
						disabled={items.length <= 0}
					>
						<b>Enviar por WhatsApp</b>
					</Button>

					<div className="md:ml-5 max-md:mt-2">
						<Button
							size="medium"
							variant="contained"
							endIcon={<ShoppingCart />}
							onClick={() => sendMessage()}
							className="w-auto max-md:w-full"
							disabled={items.length <= 0}
						>
							<b>Comprar</b>
						</Button>
					</div>

					<div className="ml-auto w-full mt-2 md:mt-0 md:w-auto">
						<Button
							size="medium"
							variant="contained"
							onClick={() => emtyCart()}
							className="w-full"
							disabled={items.length <= 0}
						>
							<b>Vaciar</b>
						</Button>
					</div>
				</>
			}
		/>
	);
}
