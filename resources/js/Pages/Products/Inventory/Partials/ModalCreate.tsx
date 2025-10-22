import { router } from "@inertiajs/react";
import { Inventory2 } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Divider,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
	FormProvider,
	useFieldArray,
	useForm,
	useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useModal } from "@/Context/Modal";
import CreateForm from "@/Pages/Products/Partials/Form";
import ProductSelector from "./ProductSelector";
import QuantityInput from "./QuantityInput";

type Props = {
	onClose: () => void;
};

type ItemData = {
	product: number | null;
	stock: number;
};

type FormData = {
	items: ItemData[];
	reason?: string;
	files?: File[];
};

export default function ModalCreate({ onClose }: Props) {
	const methods = useForm<FormData>({
		defaultValues: { items: [{ product: null, stock: 0 }] },
	});
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = methods;

	const { openModal } = useModal();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const watchedProducts = useWatch({
		name: fields.map(
			(_, i) => `items.${i}.product`,
		) as readonly `items.${number}.product`[],
		control,
	});

	const [productInfos, setProductInfos] = useState<(Item | null)[]>([]);
	const [loadingProducts, setLoadingProducts] = useState<boolean[]>([]);

	const fetchProduct = useCallback(async (prodId: number, index: number) => {
		setLoadingProducts((prev) => {
			const newLoading = [...prev];
			newLoading[index] = true;
			return newLoading;
		});
		try {
			type ProductsResponse = { products: paginateResponse<Item> };
			const { data } = await axios.get<ProductsResponse>(route("products"), {
				params: { id: prodId, perPage: 1 },
			});
			setProductInfos((prev) => {
				const newInfos = [...prev];
				newInfos[index] = data.products.data[0] ?? null;
				return newInfos;
			});
		} catch (e) {
			console.error("Error obteniendo producto", e);
			toast.error(
				`Error al obtener producto: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
			);
			setProductInfos((prev) => {
				const newInfos = [...prev];
				newInfos[index] = null;
				return newInfos;
			});
		} finally {
			setLoadingProducts((prev) => {
				const newLoading = [...prev];
				newLoading[index] = false;
				return newLoading;
			});
		}
	}, []);

	useEffect(() => {
		fields.forEach((_field, index) => {
			const productId = watchedProducts[index];
			if (
				productId &&
				(!productInfos[index] || productInfos[index]?.id !== productId)
			) {
				fetchProduct(productId, index);
			} else if (!productId && productInfos[index] !== null) {
				setProductInfos((prev) => {
					const newInfos = [...prev];
					newInfos[index] = null;
					return newInfos;
				});
			}
		});
	}, [watchedProducts, fields, fetchProduct]);

	const onSubmit = async (data: FormData) => {
		console.log("Submitted data:", data);
		try {
			const formData = new FormData();
			data.items.forEach((item, index) => {
				formData.append(
					`items[${index}][product]`,
					item.product?.toString() || "",
				);
				formData.append(`items[${index}][stock]`, item.stock.toString());
			});
			if (data.reason) formData.append("reason", data.reason);
			data.files?.map((file, index) =>
				formData.append(`files[${index}]`, file),
			);

			await axios.post(route("inventory.store"), formData);
			toast.success("Inventario creado correctamente");
			reset();
			onClose();
			router.reload();
		} catch (e) {
			console.error("Error creando inventario", e);
			toast.error(
				`Error al crear inventario: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
			);
		}
	};

	const addItem = () => {
		append({ product: null, stock: 0 });
		setProductInfos((prev) => [...prev, null]);
		setLoadingProducts((prev) => [...prev, false]);
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
							Crear Inventario
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
						{/* Productos */}
						<Box>
							<Typography
								variant="h6"
								fontWeight={700}
								sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
							>
								📦 Productos
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								{fields.map((field, index) => (
									<Paper
										key={field.id}
										elevation={0}
										sx={{
											p: 1.5,
											borderRadius: 2,
											border: "1px solid",
											borderColor: "divider",
											background:
												"linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
											transition: "all 0.2s",
											"&:hover": {
												borderColor: "#10b981",
												boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
											},
										}}
									>
										<Box
											sx={{
												display: "flex",
												gap: 2,
												alignItems: "center",
												flexDirection: { xs: "column", sm: "row" },
												width: "100%",
											}}
										>
											<Box
												sx={{
													flex: { xs: 1, sm: 1 },
													width: { xs: "100%", sm: "auto" },
												}}
											>
												<ProductSelector<FormData>
													name={`items.${index}.product`}
												/>
											</Box>
											<Box
												sx={{
													flex: { xs: 1, sm: 2 },
													width: { xs: "100%", sm: "auto" },
												}}
											>
												<QuantityInput
													productInfo={productInfos[index]}
													name={`items.${index}.stock`}
												/>
											</Box>
											{fields.length > 1 && (
												<Box
													sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
												>
													<Tooltip title="Eliminar producto">
														<IconButton
															color="error"
															onClick={() => remove(index)}
															sx={{
																"&:hover": {
																	background: "rgba(239, 68, 68, 0.1)",
																},
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</Box>
											)}
										</Box>
									</Paper>
								))}
							</Box>
						</Box>

						{/* Botones de acción */}
						<Box
							sx={{
								display: "flex",
								gap: 2,
								flexDirection: { xs: "column", sm: "row" },
								alignItems: { xs: "stretch", sm: "flex-start" },
							}}
						>
							<Button
								variant="contained"
								onClick={addItem}
								startIcon={<AddIcon />}
								sx={{
									background:
										"linear-gradient(135deg, #10b981 0%, #059669 100%)",
									px: 3,
									py: 1.5,
									borderRadius: 2,
									fontWeight: 600,
									textTransform: "none",
									flex: { xs: 1, sm: "auto" },
									"&:hover": {
										background:
											"linear-gradient(135deg, #059669 0%, #047857 100%)",
									},
								}}
							>
								Añadir Producto
							</Button>
							<Tooltip title="Crear nuevo producto">
								<Button
									variant="outlined"
									color="success"
									onClick={() =>
										openModal(({ closeModal }) => (
											<ModalStyled
												header={
													<h2 className="text-lg font-semibold">
														Crear Nuevo Producto
													</h2>
												}
												body={<CreateForm />}
												footer={<></>}
												onClose={closeModal}
											/>
										))
									}
									sx={{
										px: 3,
										py: 1.5,
										borderRadius: 2,
										fontWeight: 600,
										textTransform: "none",
										borderWidth: 2,
										flex: { xs: 1, sm: "auto" },
										"&:hover": {
											borderWidth: 2,
										},
									}}
								>
									<AddIcon />
								</Button>
							</Tooltip>
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
						{productInfos.some((p) => p) && (
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
						background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
						px: { xs: 3, sm: 5 },
						py: 1.5,
						borderRadius: 2,
						fontWeight: 700,
						textTransform: "none",
						fontSize: { xs: 14, sm: 16 },
						width: { xs: "100%", sm: "auto" },
						"&:hover": {
							background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
						},
					}}
				>
					Crear Inventario
				</Button>
			}
		/>
	);
}
