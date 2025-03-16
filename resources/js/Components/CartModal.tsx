import Modal from "@/Components/Modal";
import ProductsInCar from "@/Components/ProductsInCar";
import { Close, WhatsApp } from "@mui/icons-material";
import Button from "@mui/material/Button";
import shoppingCart from "@/shoppingCart";

export default function CartModal({
	show,
	setOpen,
}: { show: boolean; setOpen: (open: boolean) => void }) {
	function emtyCart() {
		const cart = new shoppingCart();
		cart.clear();
	}

	return (
		<Modal show={show} onClose={() => setOpen(false)} maxWidth="2xl">
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
			<div className="p-3 flex">
				<ProductsInCar item={{ image: "", name: "test", price: 12 } as Item} />
			</div>
			<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100 md:flex">
				<Button size="medium" variant="contained" endIcon={<WhatsApp />}>
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
		</Modal>
	);
}
