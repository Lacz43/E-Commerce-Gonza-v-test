import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import shoppingCart from "@/shoppingCart";
import { imageUrl } from "@/utils";

type ProductDetailsModalProps = {
	closeModal: () => void;
	productId: number;
};

type Product = Item & {
	stock: number;
	available_stock: number;
};

export default function ProductDetailsModal({
	closeModal,
	productId,
}: ProductDetailsModalProps) {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	useEffect(() => {
		fetchProductDetails();
	}, [productId]);

	const fetchProductDetails = async () => {
		try {
			setLoading(true);
			const response = await axios.get(route("products"), {
				params: { id: productId, whitImages: true, minAvailableStock: 0 },
			});
			const productData = response.data.products.data[0];
			setProduct(productData);
			console.log(productData);
		} catch (error) {
			console.error("Error fetching product details:", error);
			toast.error("Error al cargar los detalles del producto");
			closeModal();
		} finally {
			setLoading(false);
		}
	};

	const addToCart = () => {
		if (product) {
			const cart = new shoppingCart();
			cart.add({
				id: product.id,
				default_image: product.default_image,
				name: product.name,
				price: product.price,
				barcode: product.barcode,
			} as Item);
			toast.success("Producto añadido al carrito");
		}
	};
	if (loading) {
		return (
			<ModalStyled
				header={<h2 className="text-lg font-semibold">Cargando producto...</h2>}
				body={
					<div className="max-w-6xl mx-auto">
						{/* Responsive Layout: Images + Info Side by Side on Desktop */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
							{/* Left Column: Image Skeleton */}
							<div className="order-2 lg:order-1">
								<Skeleton
									variant="rectangular"
									className="w-full aspect-square lg:aspect-video max-h-96 rounded-xl"
								/>
							</div>

							{/* Right Column: Content Skeleton */}
							<div className="order-1 lg:order-2 space-y-6">
								<div className="text-center lg:text-left space-y-2">
									<Skeleton
										variant="text"
										height={40}
										width="80%"
										className="mx-auto lg:mx-0"
									/>
									<Skeleton
										variant="text"
										height={50}
										width="60%"
										className="mx-auto lg:mx-0"
									/>
								</div>

								<div className="space-y-3">
									<Skeleton variant="rectangular" height={40} />
									<Skeleton variant="rectangular" height={40} />
									<Skeleton variant="rectangular" height={40} />
									<Skeleton variant="rectangular" height={40} />
								</div>

								<Skeleton variant="rectangular" height={80} />
							</div>
						</div>
					</div>
				}
				footer={
					<Button onClick={closeModal} variant="outlined">
						Cerrar
					</Button>
				}
				onClose={closeModal}
			/>
		);
	}

	if (!product) {
		return (
			<ModalStyled
				header={
					<h2 className="text-lg font-semibold">Producto no encontrado</h2>
				}
				body={
					<div className="max-w-4xl mx-auto text-center py-8">
						<div className="text-gray-400 mb-4">
							<svg
								className="w-16 h-16 mx-auto"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
							>
								<title>Producto no encontrado</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.978-5.5-2.5m.5-7.5h11a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
								/>
							</svg>
						</div>
						<p className="text-gray-600">
							No se pudo cargar la información del producto.
						</p>
					</div>
				}
				footer={
					<Button onClick={closeModal} variant="outlined">
						Cerrar
					</Button>
				}
				onClose={closeModal}
			/>
		);
	}

	const images = product.images || [];
	const hasImages = images.length > 0;

	return (
		<ModalStyled
			header={
				<h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-100 to-emerald-100 bg-clip-text text-transparent">
					Detalles del Producto
				</h2>
			}
			body={
				<div className="max-w-6xl mx-auto">
					{/* Responsive Layout: Images + Info Side by Side on Desktop */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Left Column: Image Gallery */}
						<div className="order-2 lg:order-1">
							{hasImages && (
								<div className="space-y-4">
									{/* Main Image */}
									<div className="relative aspect-square lg:aspect-video max-h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-emerald-50 shadow-2xl border-2 border-orange-100/50">
										<img
											src={imageUrl(images[selectedImageIndex].image)}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
										/>
										{/* Image counter */}
										{images.length > 1 && (
											<div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
												{selectedImageIndex + 1} / {images.length}
											</div>
										)}
									</div>

									{/* Thumbnail Gallery */}
									{images.length > 1 && (
										<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
											{images.map((image, index) => (
												<button
													key={index}
													onClick={() => setSelectedImageIndex(index)}
													className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
														selectedImageIndex === index
															? "border-emerald-500 ring-2 ring-emerald-200 shadow-lg"
															: "border-orange-100 hover:border-orange-300"
													}`}
													aria-label={`Ver imagen ${index + 1} de ${product.name}`}
												>
													<img
														src={imageUrl(image.image)}
														alt={`${product.name} - imagen ${index + 1}`}
														className="w-full h-full object-cover"
														loading="lazy"
													/>
												</button>
											))}
										</div>
									)}
								</div>
							)}
						</div>

						{/* Right Column: Product Details */}
						<div className="order-1 lg:order-2 space-y-6">
							{/* Header with Name and Price */}
							<div className="text-center lg:text-left">
								<h3 className="text-2xl lg:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
									{product.name}
								</h3>
								<div className="flex items-baseline gap-2 justify-center lg:justify-start">
									<span className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
										{product.price.toFixed(2)}
									</span>
									<span className="text-lg font-medium text-slate-500">Bs</span>
								</div>
							</div>

							{/* Product Info Grid */}
							<div className="space-y-4">
								{/* Barcode */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										📦 Código:
									</span>
									<code className="px-4 py-2 bg-gradient-to-r from-orange-50 to-emerald-50 rounded-xl text-sm font-mono text-slate-800 border-2 border-orange-100/50 font-semibold">
										{product.barcode}
									</code>
								</div>

								{/* Stock Status */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										📊 Stock disponible:
									</span>
									<span
										className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
											product.available_stock && product.available_stock > 0
												? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-2 border-emerald-300"
												: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300"
										}`}
									>
										{product.available_stock ?? 0} unidades
									</span>
								</div>

								{/* Brand */}
								{product.brand && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-2">
										<span className="text-sm font-bold text-slate-600 min-w-fit">
											🏷️ Marca:
										</span>
										<span className="px-3 py-1.5 bg-orange-50 text-orange-700 font-semibold text-sm rounded-lg border border-orange-200">
											{product.brand.name}
										</span>
									</div>
								)}

								{/* Category */}
								{product.category && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-2">
										<span className="text-sm font-bold text-slate-600 min-w-fit">
											📂 Categoría:
										</span>
										<span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-lg border border-emerald-200">
											{product.category.name}
										</span>
									</div>
								)}
							</div>

							{/* Description */}
							{product.description && (
								<div className="border-t-2 border-orange-100 pt-6">
									<h4 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
										📝 Descripción:
									</h4>
									<div className="bg-gradient-to-br from-orange-50/50 to-emerald-50/50 rounded-xl p-5 border-2 border-orange-100/50">
										<p className="text-slate-700 leading-relaxed whitespace-pre-line">
											{product.description}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			}
			footer={
				<div className="flex flex-col sm:flex-row gap-3 w-full">
					<button
						type="button"
						onClick={addToCart}
						className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
					>
						<ShoppingCartIcon fontSize="small" />
						Añadir al Carrito
					</button>
					<button
						type="button"
						onClick={closeModal}
						className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200"
					>
						Cerrar
					</button>
				</div>
			}
			onClose={closeModal}
		/>
	);
}
