import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Skeleton } from "@mui/material";
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
				params: { id: productId, whitImages: true, minAvailableStock: 1 },
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
				<h2 className="text-lg font-semibold text-gray-800">
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
									<div className="relative aspect-square lg:aspect-video max-h-96 overflow-hidden rounded-xl bg-gray-100 shadow-lg">
										<img
											src={imageUrl(images[selectedImageIndex].image)}
											alt={product.name}
											className="w-full h-full object-cover transition-all duration-300"
										/>
										{/* Image counter */}
										{images.length > 1 && (
											<div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
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
													className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
														selectedImageIndex === index
															? "border-green-500 ring-2 ring-green-200 shadow-md"
															: "border-gray-200 hover:border-gray-400"
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
								<h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
									{product.name}
								</h3>
								<div className="text-3xl lg:text-4xl font-bold text-green-600 mb-6">
									{product.price.toFixed(2)} Bs
								</div>
							</div>

							{/* Product Info Grid */}
							<div className="space-y-4">
								{/* Barcode */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-semibold text-gray-600 min-w-fit">
										Código:
									</span>
									<code className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 border">
										{product.barcode}
									</code>
								</div>

								{/* Stock Status */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="text-sm font-semibold text-gray-600 min-w-fit">
										Stock disponible:
									</span>
									<span
										className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
											product.available_stock && product.available_stock > 0
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{product.available_stock ?? 0} unidades
									</span>
								</div>

								{/* Brand */}
								{product.brand && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-2">
										<span className="text-sm font-semibold text-gray-600 min-w-fit">
											Marca:
										</span>
										<span className="text-sm text-gray-900 font-medium">
											{product.brand.name}
										</span>
									</div>
								)}

								{/* Category */}
								{product.category && (
									<div className="flex flex-col sm:flex-row sm:items-center gap-2">
										<span className="text-sm font-semibold text-gray-600 min-w-fit">
											Categoría:
										</span>
										<span className="text-sm text-gray-900 font-medium">
											{product.category.name}
										</span>
									</div>
								)}
							</div>

							{/* Description */}
							{product.description && (
								<div className="border-t pt-6">
									<h4 className="text-sm font-semibold text-gray-600 mb-3">
										Descripción:
									</h4>
									<div className="bg-gray-50 rounded-lg p-4">
										<p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
				<div className="flex gap-2">
					<Button
						onClick={addToCart}
						variant="contained"
						startIcon={<ShoppingCartIcon />}
						fullWidth
						sx={{
							color: "#FFFFFF",
							textTransform: "none",
							fontWeight: 600,
							letterSpacing: ".5px",
							borderRadius: "1rem",
							paddingY: 1.2,
							whiteSpace: "nowrap",
							background:
								"linear-gradient(90deg,rgba(255, 124, 10, 1) 12%, rgba(0, 214, 89, 1) 80%, rgba(237, 221, 83, 1) 100%)",
							boxShadow: "0 4px 14px 0 rgba(13,148,136,.35)",
							"&:hover": {
								background:
									"linear-gradient(90deg,rgba(199, 95, 4, 1) 12%, rgba(0, 186, 78, 1) 80%, rgba(199, 186, 72, 1) 100%)",
								boxShadow: "0 6px 20px 0 rgba(13,148,136,.45)",
							},
							"& .MuiButton-startIcon": { color: "rgba(255,255,255,0.9)" },
							"&:active": { transform: "translateY(1px)" },
							"&:focus-visible": {
								outline: "2px solid #0d9488",
								outlineOffset: "2px",
							},
						}}
					>
						Añadir al Carrito
					</Button>
					<Button onClick={closeModal} variant="outlined" fullWidth>
						Cerrar
					</Button>
				</div>
			}
			onClose={closeModal}
		/>
	);
}
