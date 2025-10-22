import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { imageUrl } from "@/utils";

type ModalShowInventoryProductProps = {
	closeModal: () => void;
	productId: number;
};

type Product = Item & {
	stock: number;
};

type Movement = {
	id: number;
	quantity: number;
	previous_stock: number;
	type: "ingress" | "egress";
	user: {
		name: string;
	};
	created_at: string;
	model_type: string;
};

const ModalShowInventoryProduct: React.FC<ModalShowInventoryProductProps> = ({
	closeModal,
	productId,
}) => {
	const [product, setProduct] = useState<Product | null>(null);
	const [movements, setMovements] = useState<Movement[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchProductDetails = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(route("products"), {
				params: { id: productId },
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

	const fetchMovements = useCallback(async () => {
		try {
			const response = await axios.get(
				route("inventory.movements.byProduct", productId),
			);
			setMovements(response.data);
		} catch (error) {
			console.error("Error fetching movements:", error);
			// Don't show error toast for movements, just log it
		}
	}, [productId]);

	useEffect(() => {
		fetchProductDetails();
		fetchMovements();
	}, [fetchProductDetails, fetchMovements]);

	if (loading) {
		return (
			<ModalStyled
				header={<h2 className="text-lg font-semibold">Cargando producto...</h2>}
				body={
					<div className="max-w-4xl mx-auto">
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<Skeleton
									variant="rectangular"
									width={80}
									height={80}
									className="rounded-lg"
								/>
								<div className="space-y-2">
									<Skeleton variant="text" height={30} width={200} />
									<Skeleton variant="text" height={20} width={150} />
								</div>
							</div>
							<div className="space-y-3">
								<Skeleton variant="rectangular" height={40} />
								<Skeleton variant="rectangular" height={40} />
							</div>
							<div className="space-y-3">
								<Skeleton variant="text" height={20} width={100} />
								<Skeleton variant="rectangular" height={60} />
								<Skeleton variant="rectangular" height={60} />
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
								aria-label="Producto no encontrado"
							>
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

	return (
		<ModalStyled
			header={
				<h2 className="text-2xl font-extrabold bg-clip-text">
					Detalles del Inventario - {product.name}
				</h2>
			}
			body={
				<div className="max-w-6xl mx-auto">
					<div className="space-y-6">
						{/* Basic Product Info */}
						<div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
							<img
								src={
									product.default_image?.image
										? imageUrl(product.default_image.image)
										: "/placeholder-product.png"
								}
								alt={product.name}
								className="w-20 h-20 object-cover rounded-lg border-2 border-blue-100"
							/>
							<div className="flex-1">
								<h3 className="text-xl font-bold text-slate-800">
									{product.name}
								</h3>
								<p className="text-sm text-slate-600">
									Código: {product.barcode}
								</p>
								<p className="text-sm text-slate-600">
									Stock actual: {product.stock ?? 0} unidades
								</p>
							</div>
						</div>

						{/* Last Movements */}
						<div className="border-t-2 border-blue-100 pt-6">
							<h4 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
								📊 Últimos Movimientos
							</h4>
							{movements.length > 0 ? (
								<div className="space-y-3 max-h-96 overflow-y-auto">
									{movements.map((movement) => (
										<div
											key={movement.id}
											className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div
														className={`w-3 h-3 rounded-full ${
															movement.type === "ingress"
																? "bg-green-500"
																: "bg-red-500"
														}`}
													></div>
													<div>
														<p className="font-semibold text-slate-800">
															{movement.type === "ingress"
																? "Entrada"
																: "Salida"}{" "}
															de {Math.abs(movement.quantity)} unidades
														</p>
														<p className="text-xs text-slate-500">
															Por {movement.user.name} •{" "}
															{new Date(movement.created_at).toLocaleDateString(
																"es-ES",
																{
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm text-slate-600">
														Antes: {movement.previous_stock} • Después:{" "}
														{movement.previous_stock + movement.quantity}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-slate-500">
									<p>Aún no hay movimientos registrados para este producto.</p>
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
};

export default ModalShowInventoryProduct;
