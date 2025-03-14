import ApplicationLogo from "@/Components/ApplicationLogo";
import Navbar from "@/Components/Navbar";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import Modal from "@/Components/Modal";
import ProductsInCar from "@/Components/ProductsInCar";
import { Close, WhatsApp } from "@mui/icons-material";
import Button from "@mui/material/Button";

export default function Ecommerce({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
			<Navbar />
			<div>
				<Link href="/">
					<ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
				</Link>
			</div>

			{children}

			<Modal show={true} onClose={() => console.log("test")} maxWidth="2xl">
				<div className="border-b border-b-gray-300 py-2 px-4 text-xl bg-gray-100 flex">
					<h2 className="font-bold">Carrito</h2>
					<button type="button" className="ml-auto">
						<Close />
					</button>
				</div>
				<div className="p-3 flex">
					<ProductsInCar
						item={{ image: "", name: "test", price: 12 } as Item}
					/>
				</div>
				<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100">
					<Button size="medium" variant="contained" endIcon={<WhatsApp />}>
						<b>Enviar pedido por WhatsApp</b>
					</Button>
				</div>
			</Modal>
		</div>
	);
}
