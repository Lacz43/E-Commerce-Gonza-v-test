// import { router } from "@inertiajs/react";
import Ecommerce from "@/Layouts/EcommerceLayout";
import InfiniteScroll from "@/Components/InfiniteScroll";
import ProductCard from "@/Components/ProductCard";
import "../../css/welcome.css";
import { useEffect } from "react";

export default function Welcome() {
	useEffect(() => {
		const products = new IntersectionObserver((entries) => {
			// inspector de elementos
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible"); // si es visible, agregar la clase visible
				} else {
					entry.target.classList.remove("visible"); // remover la clase visible
				}
			}
		});
		const element = document.querySelector(".content");
		if (element) products.observe(element); // observar el elemento
	}, []);

	return (
		<Ecommerce>
			<title>Gonza</title>
			<div className="h-dvh">
				<h2 className="text-5xl font-bold text-center">Gonza</h2>

				<p className="mt-5 font-light text-2xl text-gray-600">
					La mejor opcion para realizar tus compras
				</p>
			</div>

			<InfiniteScroll
				url={route("products")}
				className="content my-5 mx-2 flex flex-wrap justify-center gap-4"
			>
				{{
					card: (item) => (
						<ProductCard key={item.id} item={item} className="" />
					),
					loading: <div>Loading...</div>,
				}}
			</InfiniteScroll>
		</Ecommerce>
	);
}
