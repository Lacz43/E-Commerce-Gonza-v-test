import Modal from "@/Components/Modal";
import ProductsInCar from "@/Components/ProductsInCar";
import { Close, WhatsApp } from "@mui/icons-material";
import Button from "@mui/material/Button";
import shoppingCart from "@/shoppingCart";
import { useEffect, useState } from "react";

export default function CartModal({
	show,
	setOpen,
}: { show: boolean; setOpen: (open: boolean) => void }) {
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
		let url = `https://wa.me/${import.meta.env.VITE_COMPANY_PHONE}`;

        const cart = new shoppingCart();
        let message = "";

        for(const item of cart.items){
            message += `${item.name} \t${item.quantity}\n`;
        }

		url += `?text=${encodeURI(message)}`;
		window.open(url);
	}

	return (
		<Modal show={show} onClose={() => setOpen(false)} maxWidth="2xl">
			<div className="max-h-dvh flex flex-col">
				<div className="border-b border-b-gray-300 py-2 px-4 text-xl bg-gray-100 flex">
					<h2 className="font-bold">Carrito</h2>
					<button
						type="button"
						className="ml-auto"
						onClick={() => setOpen(false)}
					>
						<Close />
					</button>
				</div>
				<div className="p-3 overflow-x-hidden overflow-y-scroll">
					{items.map((it) => (
						<ProductsInCar item={it} key={it.id} />
					))}
				</div>
				<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100 md:flex">
					<Button
						size="medium"
						variant="contained"
						endIcon={<WhatsApp />}
						onClick={() => sendMessage()}
                        className="w-full md:w-auto"
					>
						<b>Enviar pedido por WhatsApp</b>
					</Button>

					<div className="ml-auto w-full mt-2 md:mt-0 md:w-auto">
						<Button
							size="medium"
							variant="contained"
							onClick={() => emtyCart()}
							className="w-full"
						>
							<b>Vaciar</b>
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
