import ProductCard from "@/Components/ProductCard";
import Ecommerce from "@/Layouts/EcommerceLayout";
import "../../css/welcome.css";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { lazy, Suspense, useEffect, useState } from "react";
import type {
	GenericInfiniteScroll,
	InfiniteScrollProps,
} from "@/Components/InfiniteScroll";
import InputProductSearch from "@/Components/InputProductSearch";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import shoppingCart from "@/shoppingCart";
import { imageUrl } from "@/utils";

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
	const { settings } = useGeneralSettings();
	const [searchParams, setSearchParams] = useState<{
		search?: string;
		id?: string;
		barcode?: string;
		name?: string;
	}>({});

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
			<title>{settings.company_name}</title>
			{/* Hero Section - Estilo Cover */}
			<div className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
				{/* Efectos de fondo decorativos del hero */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/40 to-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
					<div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>
					<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-orange-100/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
				</div>

				<div className="relative max-w-4xl z-10 flex-1 flex flex-col justify-center">
					{/* Logo de la empresa con efectos */}
					{settings.company_logo_url && (
						<div className="flex justify-center mb-8 animate-fade-in-down">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-orange-200/50 to-emerald-200/50 rounded-full blur-2xl opacity-40 animate-pulse"></div>
								<img
									src={imageUrl(settings.company_logo_url)}
									alt={`Logo de ${settings.company_name}`}
									className="relative h-44 w-44 md:h-64 md:w-64 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
								/>
							</div>
						</div>
					)}

					{/* Título principal con gradiente */}
					<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg mb-6 animate-fade-in">
						{settings.company_name}
					</h1>

					{/* Subtítulo destacado */}
					<p className="text-xl md:text-3xl font-semibold text-slate-700 leading-relaxed max-w-3xl mx-auto mb-4 animate-fade-in-up">
						La mejor opción para realizar tus compras con{" "}
						<span className="text-orange-600">rapidez</span>,{" "}
						<span className="text-emerald-600">variedad</span> y{" "}
						<span className="text-orange-600">confianza</span>
					</p>

					{/* Descripción */}
					<p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200">
						Explora productos frescos, ofertas exclusivas y más — todo en un
						solo lugar
					</p>

					{/* Badges de características */}
					<div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up delay-300">
						<span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700 shadow-lg border border-orange-200/50 hover:shadow-xl hover:scale-105 transition-all">
							🚀 Entrega Rápida
						</span>
						<span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700 shadow-lg border border-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all">
							✨ Productos Frescos
						</span>
						<span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700 shadow-lg border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all">
							💯 Mejor Precio
						</span>
					</div>
				</div>

				{/* Botón de scroll mejorado */}
				<a
					href="#productos"
					className="group absolute bottom-18 flex flex-col items-center gap-2 text-slate-600 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-110 z-10"
					aria-label="Ir a la lista de productos"
				>
					<span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
						Ver Productos
					</span>
					<div className="relative">
						<div className="absolute inset-0 bg-emerald-400/50 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
						<ArrowDownwardRoundedIcon className="relative animate-bounce text-emerald-600" />
					</div>
				</a>
			</div>

			{/* Sección de Productos */}
			<div
				id="productos"
				className="content w-full scroll-mt-10 py-16 relative"
			>
				{/* Fondo decorativo sutil */}
				<div className="absolute inset-0 bg-gradient-to-b from-white/50 via-orange-50/10 to-emerald-50/10 pointer-events-none"></div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					{/* Título de sección */}
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
							Nuestros Productos
						</h2>
						<p className="text-slate-700 text-lg md:text-xl font-medium mb-4">
							Encuentra lo que necesitas con la mejor calidad
						</p>
						<div className="flex justify-center">
							<div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full"></div>
						</div>
					</div>

					{/* Barra de búsqueda mejorada */}
					<div className="mb-12">
						<InputProductSearch
							className="mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-orange-100/50 hover:shadow-2xl hover:border-emerald-300/50 transition-all"
							onSearchChange={setSearchParams}
						/>
					</div>

					{/* Grid de productos */}
					<Suspense>
						<InfiniteScroll<Item, "products">
							url={route("products", {
								minStock: 1,
								useImage: true,
								minAvailableStock: 1,
								...searchParams,
							})}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
							transformResponse={(res) => res.products}
							key={JSON.stringify(searchParams)}
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
			</div>
		</Ecommerce>
	);
}
