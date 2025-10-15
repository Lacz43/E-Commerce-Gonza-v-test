import { ShoppingCart, WhatsApp } from "@mui/icons-material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import ProductsInCar from "@/Components/ProductsInCar";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import shoppingCart from "@/shoppingCart";

type Props = {
	onClose: () => void;
};

export default function CartModal({ onClose }: Props) {
	const [items, setItems] = useState<Item[]>([]);
	const { settings } = useGeneralSettings();

	function emtyCart() {
		const cart = new shoppingCart();
		cart.clear();
		setItems([]);
	}

	useEffect(() => {
		const cart = new shoppingCart();
		setItems(cart.items);
	}, []);

	const createOrder = useCallback(
		async (
			items: { product_id: string | number; quantity: number | string }[],
		) => {
			const response = await axios.post(route("order.store"), { items });
			return response.data.order_id;
		},
		[],
	);

	useEffect(() => {
		addEventListener("addCart", () => {
			const cart = new shoppingCart();
			setItems(cart.items);
		});
		return () => removeEventListener("addCart", () => {});
	}, []);

	const sendMessage = useCallback(async () => {
		// mover a otro componente

		// construir el mensaje para enviar por whatsapp
		let url = `https://wa.me/${settings.company_phone}`;

		const cart = new shoppingCart();
		const items = cart.items.map((item) => ({
			product_id: item.id,
			quantity: item.quantity ?? 1,
		}));

		try {
			const orderId = await createOrder(items);

			let message = `Orden ID: ${orderId}\n`;
			for (const item of cart.items) {
				message += `${item.name} \t${item.quantity}\n`;
			}
			url += `?text=${encodeURI(message)}`;
			window.open(url);
			cart.clear();
			setItems([]);
			onClose();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log("Axios error:", error.response?.data);
				toast.error(error.response?.data?.message || "Error al crear la orden");
			} else {
				console.log("Unexpected error:", error);
				toast.error("Error inesperado");
			}
		}
	}, [createOrder, settings.company_phone]);

	const sendOrder = useCallback(async () => {
		const cart = new shoppingCart();
		const items = cart.items.map((item) => ({
			product_id: item.id,
			quantity: item.quantity ?? 1,
		}));

		try {
			const orderId = await createOrder(items);
			toast.success(`Orden creada exitosamente. ID: ${orderId}`);
			cart.clear();
			setItems([]);
			onClose();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log("Axios error:", error.response?.data);
				toast.error(error.response?.data?.message || "Error al crear la orden");
			} else {
				console.log("Unexpected error:", error);
				toast.error("Error inesperado");
			}
		}
	}, [onClose, createOrder]);

	return (
		<ModalStyled
			onClose={onClose}
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
					{settings.company_phone && (
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
					)}

					<div className="md:ml-5 max-md:mt-2">
						<Button
							size="medium"
							variant="contained"
							endIcon={<ShoppingCart />}
							onClick={() => sendOrder()}
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
