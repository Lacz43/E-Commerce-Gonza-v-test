import { router } from "@inertiajs/react";
import { Edit } from "@mui/icons-material";
import {
	Box,
	Button,
	Divider,
	Paper,
	Skeleton,
	TextField,
	Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import Image from "@/Components/Image";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { imageUrl } from "@/utils";
import QuantityInput from "./QuantityInput";

type Props = {
	id: number;
	onClose: () => void;
};

type FormData = {
	stock: number;
	reason?: string;
	files?: File[];
};

function isProductInfo(p: Item | null): p is Item {
	return !!p; // campos son opcionales, con que exista el objeto basta
}

export default function ModalEdit({ onClose, id }: Props) {
	const methods = useForm<FormData>({
		defaultValues: { stock: 0 },
	});
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = methods;

	const [productInfo, setProductInfo] = useState<Item | null>(null);
	const [loadingProduct, setLoadingProduct] = useState(false);

	useEffect(() => {
		async function fetchProduct(prodId: number) {
			setLoadingProduct(true);
			try {
				type ProductsResponse = { products: paginateResponse<Item> };
				const { data } = await axios.get<ProductsResponse>(route("products"), {
					params: { id: prodId, perPage: 1 },
				});
				setProductInfo(data.products.data[0] ?? null);
			} catch (e) {
				console.error("Error obteniendo producto", e);
				toast.error(
					`Error al obtener producto: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
				);
				setProductInfo(null);
			} finally {
				setLoadingProduct(false);
			}
		}

		fetchProduct(id);
	}, [id]);

	useEffect(() => {
		if (!productInfo) reset();
	}, [productInfo]);

	const onSubmit = async (data: FormData) => {
		try {
			const formData = new FormData();
			formData.append("stock", data.stock.toString());
			if (data.reason) formData.append("reason", data.reason);
			data.files?.map((file, index) =>
				formData.append(`files[${index}]`, file),
			);
			formData.append("_method", "PUT");

			await axios.post(route("inventory.update", id), formData);
			toast.success("Inventario actualizado correctamente");
			onClose();
			router.visit(route("inventory.index"), {
				preserveState: true,
				preserveScroll: true,
			});
		} catch (e) {
			console.error("Error actualizando inventario", e);
			toast.error(
				`Error al actualizar inventario: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
			);
		}
	};

	return (
		<ModalStyled
			onClose={onClose}
			header={
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						flexDirection: { xs: "column", sm: "row" },
						textAlign: { xs: "center", sm: "left" },
					}}
				>
					<Box>
						<Typography
							variant="h5"
							fontWeight={700}
							sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
						>
							Editar Inventario #{id}
						</Typography>
					</Box>
				</Box>
			}
			body={
				<FormProvider {...methods}>
					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: { xs: 2, sm: 3 },
							px: { xs: 1, sm: 0 },
						}}
					>
						{/* Información del Producto */}
						<Box>
							<Typography
								variant="h6"
								fontWeight={700}
								sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
							>
								📦 Producto
							</Typography>
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2, sm: 3 },
									borderRadius: 2,
									border: "1px solid",
									borderColor: "divider",
									background:
										"linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
								}}
							>
								{loadingProduct ? (
									<Box
										sx={{
											display: "flex",
											gap: 2,
											flexDirection: { xs: "column", sm: "row" },
										}}
									>
										<Skeleton
											variant="rectangular"
											width={100}
											height={100}
											sx={{
												borderRadius: 2,
												alignSelf: { xs: "center", sm: "flex-start" },
											}}
										/>
										<Box
											sx={{
												flex: 1,
												display: "flex",
												flexDirection: "column",
												gap: 1,
												textAlign: { xs: "center", sm: "left" },
											}}
										>
											<Skeleton variant="text" width="60%" height={24} />
											<Skeleton variant="text" width="40%" height={20} />
											<Skeleton variant="text" width="50%" height={20} />
										</Box>
									</Box>
								) : productInfo ? (
									<Box
										sx={{
											display: "flex",
											gap: 2,
											alignItems: { xs: "center", sm: "flex-start" },
											flexDirection: { xs: "column", sm: "row" },
											textAlign: { xs: "center", sm: "left" },
										}}
									>
										<Box
											sx={{
												width: { xs: 120, sm: 100 },
												height: { xs: 120, sm: 100 },
												borderRadius: 2,
												overflow: "hidden",
												border: "1px solid",
												borderColor: "divider",
												flexShrink: 0,
												alignSelf: { xs: "center", sm: "flex-start" },
											}}
										>
											<Image
												src={imageUrl(productInfo?.default_image?.image ?? "")}
												alt={productInfo?.name ?? ""}
												width={120}
												height={120}
												style={{
													objectFit: "cover",
													width: "100%",
													height: "100%",
												}}
											/>
										</Box>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography
												variant="h6"
												fontWeight={700}
												sx={{
													mb: 1,
													fontSize: { xs: "1.1rem", sm: "1.25rem" },
												}}
											>
												{productInfo?.name}
											</Typography>
											{productInfo?.barcode && (
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{
														mb: 0.5,
														fontSize: { xs: "0.875rem", sm: "0.875rem" },
													}}
												>
													<strong>Código:</strong> {productInfo.barcode}
												</Typography>
											)}
											{isProductInfo(productInfo) &&
												productInfo.brand?.name && (
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{
															mb: 0.5,
															fontSize: { xs: "0.875rem", sm: "0.875rem" },
														}}
													>
														<strong>Marca:</strong> {productInfo.brand.name}
													</Typography>
												)}
											{productInfo?.description && (
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{
														fontSize: { xs: "0.875rem", sm: "0.875rem" },
														display: { xs: "-webkit-box", sm: "block" },
														WebkitLineClamp: { xs: 2, sm: "none" },
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
														textOverflow: "ellipsis",
													}}
												>
													<strong>Descripción:</strong>{" "}
													{productInfo.description}
												</Typography>
											)}
										</Box>
									</Box>
								) : (
									<Typography
										variant="body2"
										color="text.secondary"
										fontStyle="italic"
										textAlign="center"
									>
										No se pudo cargar la información del producto
									</Typography>
								)}
							</Paper>
						</Box>

						<Divider />

						{/* Ajuste de Stock */}
						<Box>
							<Typography
								variant="h6"
								fontWeight={700}
								sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
							>
								📊 Ajuste de Stock
							</Typography>
							<QuantityInput productInfo={productInfo} />
						</Box>

						<Divider />

						{/* Razón de ajuste */}
						<Box>
							<Typography
								variant="h6"
								fontWeight={700}
								sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
							>
								📝 Información Adicional
							</Typography>
							<TextField
								{...register("reason")}
								label="Razón de ajuste (opcional)"
								type="text"
								multiline
								rows={3}
								variant="filled"
								error={!!errors.reason}
								helperText={errors.reason?.message}
								fullWidth
								sx={{
									"& .MuiFilledInput-root": {
										borderRadius: 2,
									},
								}}
							/>
						</Box>

						{/* Archivos adjuntos */}
						{productInfo && (
							<Box>
								<Typography
									variant="h6"
									fontWeight={700}
									sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
								>
									📎 Archivos Adjuntos
								</Typography>
								<FileUpload name="files" />
							</Box>
						)}
					</Box>
				</FormProvider>
			}
			footer={
				<Button
					onClick={handleSubmit(onSubmit)}
					loading={isSubmitting}
					variant="contained"
					size="large"
					sx={{
						background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
						px: { xs: 3, sm: 5 },
						py: 1.5,
						borderRadius: 2,
						fontWeight: 700,
						textTransform: "none",
						fontSize: { xs: 14, sm: 16 },
						width: { xs: "100%", sm: "auto" },
						"&:hover": {
							background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
						},
					}}
				>
					Guardar Cambios
				</Button>
			}
		/>
	);
}
