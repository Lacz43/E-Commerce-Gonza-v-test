// import { router } from "@inertiajs/react";

import ProductCard from "@/Components/ProductCard";
import Ecommerce from "@/Layouts/EcommerceLayout";
import "../../css/welcome.css";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { lazy, Suspense, useEffect } from "react";
import type {
	GenericInfiniteScroll,
	InfiniteScrollProps,
} from "@/Components/InfiniteScroll";
import InputProductSearch from "@/Components/InputProductSearch";
import shoppingCart from "@/shoppingCart";

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
			<div
				className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden"
				style={{ minHeight: "calc(100vh - var(--navbar-h, 0px))" }}
			>
				<div className="relative max-w-3xl mt-auto">
					<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
						Gonza
					</h1>
					<p className="mt-6 text-xl md:text-2xl font-light text-slate-600 leading-relaxed">
						La mejor opción para realizar tus compras con rapidez, variedad y
						confianza.
					</p>
					<p className="mt-4 text-sm md:text-base text-slate-500">
						Explora productos frescos, ofertas y más — todo en un solo lugar.
					</p>
				</div>

				<a
					href="#productos"
					className="group mt-auto flex flex-col items-center gap-2 text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl px-3 pb-5"
					aria-label="Ir a la lista de productos"
				>
					<span className="text-xs font-medium tracking-wide uppercase">
						Productos abajo
					</span>
					<ArrowDownwardRoundedIcon className="animate-bounce mt-1" />
				</a>
			</div>

			<div id="productos" className="content mx-5 sm:mx-0 w-full scroll-mt-10">
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
