// import { router } from "@inertiajs/react";
import Ecommerce from "@/Layouts/EcommerceLayout";
import ProductCard from "@/Components/ProductCard";
import "../../css/welcome.css";
import { useEffect, lazy, Suspense } from "react";
import InputProductSearch from "@/Components/InputProductSearch";
import shoppingCart from "@/shoppingCart";
import type {
	InfiniteScrollProps,
	GenericInfiniteScroll,
} from "@/Components/InfiniteScroll";

// Importar InfiniteScroll de manera dinamica
const _InfiniteScroll = lazy(
	() => import("@/Components/InfiniteScroll"),
) as unknown as GenericInfiniteScroll; // definir tipo unknown y usar GenericInfiniteScroll

// Importar LoadingProductCard de manera dinamica
const LoadingProductCard = lazy(
	() => import("@/Components/LoadingProductCard"),
);

// Wrapper de InfiniteScroll para que sea más fácil de usar con los props
function InfiniteScroll<T, K extends string>(props: InfiniteScrollProps<T, K>) {
	return <_InfiniteScroll {...props} />;
}

export default function Welcome() {
	function addToCart(item: Item) {
		const cart = new shoppingCart();
		cart.add(item);
	}

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

			<div className="content mx-5 sm:mx-0 w-full">
				<InputProductSearch className="mx-auto bg-white" />
				<Suspense>
					<InfiniteScroll<Item, "products">
						url={route("products")}
						className="my-5 mx-2 grid grid-cols-[repeat(auto-fill,minmax(20rem,_1fr))] gap-4"
						transformResponse={(res) => res.products}
					>
						{{
							card: (item) => (
								<ProductCard
									key={item.id}
									item={item}
									className=""
									addCart={(select) => addToCart(select)}
								/>
							),
							loading: (
								<>
									{[...Array(8).fill(null)].map((_, i) => (
										<LoadingProductCard
											key={`card-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												i
											}`}
										/>
									))}
								</>
							),
						}}
					</InfiniteScroll>
				</Suspense>
			</div>
		</Ecommerce>
	);
}
