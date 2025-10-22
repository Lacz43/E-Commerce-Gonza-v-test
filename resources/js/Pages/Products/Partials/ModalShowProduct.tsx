import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import { imageUrl } from "@/utils";

type ModalShowProductProps = {
	closeModal: () => void;
	productId: number;
};

type Product = Item & {
	stock: number;
	available_stock: number;
};

export default function ModalShowProduct({
	closeModal,
	productId,
}: ModalShowProductProps) {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const { settings } = useGeneralSettings();

	const fetchProductDetails = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(route("products"), {
				params: { id: productId, whitImages: true, minAvailableStock: 0 },
			});
			const productData = response.data.products.data[0];
			setProduct(productData);
		} catch (error) {
			console.error("Error fetching product details:", error);
			toast.error("Error al cargar los detalles del producto");
			closeModal();
		} finally {
			setLoading(false);
		}
	}, [productId, closeModal]);

	useEffect(() => {
		fetchProductDetails();
	}, [fetchProductDetails]);

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
				<h2 className="text-2xl font-extrabold bg-clip-text">
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
									<div className="relative aspect-square lg:aspect-video max-h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl border-2 border-blue-100/50">
										<img
											src={imageUrl(images[selectedImageIndex].image)}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
										/>
										{/* Image counter */}
										{images.length > 1 && (
											<div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
												{selectedImageIndex + 1} / {images.length}
											</div>
										)}
									</div>

									{/* Thumbnail Gallery */}
									{images.length > 1 && (
										<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
											{images.map((image, index) => (
												<button
													key={image.id || index}
													type="button"
													onClick={() => setSelectedImageIndex(index)}
													className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
														selectedImageIndex === index
															? "border-purple-500 ring-2 ring-purple-200 shadow-lg"
															: "border-blue-100 hover:border-blue-300"
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
							{!hasImages && (
								<div className="relative aspect-square lg:aspect-video max-h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl border-2 border-gray-200 flex items-center justify-center">
									<div className="text-gray-400 text-center">
										<svg
											className="w-16 h-16 mx-auto mb-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											role="img"
											aria-label="Sin imagen disponible"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<p className="text-sm">Sin imagen</p>
									</div>
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
									<span className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
										{product.price.toFixed(2)}
									</span>
									<span className="text-lg font-medium text-slate-500">
										{settings.currency === "VES" ? "Bs" : "USD"}
									</span>
								</div>
							</div>

							{/* Product Info Grid */}
							<div className="space-y-4">
								{/* ID */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										🆔 ID:
									</span>
									<code className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-sm font-mono text-slate-800 border-2 border-blue-100/50 font-semibold">
										{product.id}
									</code>
								</div>

								{/* Barcode */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										📦 Código de barras:
									</span>
									<code className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-sm font-mono text-slate-800 border-2 border-blue-100/50 font-semibold">
										{product.barcode}
									</code>
								</div>

								{/* Stock Status */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										📊 Stock:
									</span>
									<span
										className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
											product.stock && product.stock > 0
												? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-2 border-emerald-300"
												: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300"
										}`}
									>
										{product.stock ?? 0} unidades
									</span>
								</div>

								{/* Available Stock */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-bold text-slate-600 min-w-fit">
										✅ Stock disponible:
									</span>
									<span
										className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
											product.available_stock && product.available_stock > 0
												? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300"
												: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-2 border-orange-300"
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
										<span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-lg border border-blue-200">
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
										<span className="px-3 py-1.5 bg-purple-50 text-purple-700 font-semibold text-sm rounded-lg border border-purple-200">
											{product.category.name}
										</span>
									</div>
								)}
							</div>

							{/* Description */}
							{product.description && (
								<div className="border-t-2 border-blue-100 pt-6">
									<h4 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
										📝 Descripción:
									</h4>
									<div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl p-5 border-2 border-blue-100/50">
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
				<Button
					onClick={closeModal}
					variant="outlined"
					className="w-full sm:w-auto"
				>
					Cerrar
				</Button>
			}
			onClose={closeModal}
		/>
	);
}
