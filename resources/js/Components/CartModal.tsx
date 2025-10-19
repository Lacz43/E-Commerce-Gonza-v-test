import { ShoppingCart, WhatsApp } from "@mui/icons-material";
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
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-emerald-500 flex items-center justify-center shadow-lg">
							<ShoppingCart className="text-white" fontSize="medium" />
						</div>
						<div>
							<h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-100 to-emerald-200 bg-clip-text text-transparent">
								Mi Carrito
							</h2>
							<p className="text-sm text-slate-100 font-medium">
								{items.length} {items.length === 1 ? "producto" : "productos"}
							</p>
						</div>
					</div>
					<div className="text-right px-4 py-2">
						<p className="text-xs text-slate-100 uppercase tracking-wider font-bold mb-1">
							Total a pagar
						</p>
						<p className="text-3xl font-black bg-gradient-to-r from-orange-100 to-emerald-200 bg-clip-text text-transparent">
							{settings.currency === "VES" ? "Bs " : "$ "}
							{items
								.reduce(
									(prev, curr) => curr.price * (curr.quantity ?? 1) + prev,
									0,
								)
								.toFixed(2)}
						</p>
					</div>
				</div>
			}
			body={
				<div className="space-y-3">
					{items.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-emerald-100 flex items-center justify-center">
								<ShoppingCart className="text-slate-400" fontSize="large" />
							</div>
							<p className="text-slate-500 font-medium mb-2">
								Tu carrito está vacío
							</p>
							<p className="text-sm text-slate-400">
								Agrega productos para comenzar tu compra
							</p>
						</div>
					) : (
						items.map((it) => <ProductsInCar item={it} key={it.id} />)
					)}
				</div>
			}
			footer={
				<div className="flex flex-col md:flex-row gap-3 w-full">
					{settings.company_phone && (
						<button
							type="button"
							onClick={() => sendMessage()}
							disabled={items.length <= 0}
							className="flex-1 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							<WhatsApp fontSize="small" />
							Enviar por WhatsApp
						</button>
					)}

					<button
						type="button"
						onClick={() => sendOrder()}
						disabled={items.length <= 0}
						className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						<ShoppingCart fontSize="small" />
						Comprar Ahora
					</button>

					<button
						type="button"
						onClick={() => emtyCart()}
						disabled={items.length <= 0}
						className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Vaciar Carrito
					</button>
				</div>
			}
		/>
	);
}
