import { router } from "@inertiajs/react";
import { Image, Inventory } from "@mui/icons-material";
import {
	Box,
	Button,
	FormHelperText,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import axios, {AxiosError, type AxiosResponse, toFormData } from "axios";
import { useEffect, useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageUpload from "@/Components/ImageUpload";
import ImageUrlInput from "@/Components/Products/ImageUrlInput";
import SelectionTextInput from "@/Components/Products/SelectionTextInput";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import {
	isValidEAN8,
	isValidEAN13,
	isValidGTIN14,
	isValidUPC,
	prepareFiles,
} from "@/utils";

export interface FormStruture
	extends Omit<Item, "images" | "category" | "brand"> {
	images: File[] | ProductImage[];
	image_used: number | null;
	category: number | string | null | ProductCategory;
	brand: number | string | null | ProductBrand;
}

type Props = {
	InitialValues?: Item;
};

export default function Products({ InitialValues }: Props) {
	const methods = useForm<FormStruture>({
		defaultValues: (): Promise<FormStruture> => {
			return new Promise<FormStruture>((resolve) => {
				if (InitialValues) {
					prepareFiles(
						(InitialValues.images as Array<{ image: string }>).map(
							(img) => img.image,
						),
					).then((files: File[]) => {
						resolve({ ...(InitialValues as FormStruture), images: files });
					});
				}
			});
		},
	});

	useEffect(() => {
		if (InitialValues) {
			methods.reset({
				...(InitialValues as FormStruture),
				image_used: InitialValues.images.findIndex((i) => i.default == true),
				images: [],
			});
		}
	}, []);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = methods;

	const { settings } = useGeneralSettings();

	const onSubmit = async (data: FormStruture) => {
		try {
			const formData = toFormData(data, new FormData());
			let response: AxiosResponse;
			if (data.id) {
				formData.append("_method", "PATCH");
				response = await axios.post(
					route("products.update", data.id),
					formData,
				);
				toast.success(response.data.message, { duration: 5000 });
			} else {
				response = await axios.post(route("products.storage"), formData);
				toast.success(response.data.message, { duration: 5000 });
			}
			router.visit(route("products.index"));
		} catch (e) {
			console.log(e);
			const errorMessage =
				e instanceof AxiosError ? e.response?.data.message : "";
			toast.error(
				`Error al ${data.id ? "editar" : "registrar"} producto: ${errorMessage}`,
			);
		}
	};

	const productName = useId();
	const productBarcode = useId();
	const productPrice = useId();
	const productDescription = useId();

	const validateBarcode = (value: string | undefined) => {
		const code = String(value || "").trim();
		if (!/^\d+$/.test(code)) {
			return "El código debe contener solo números.";
		}
		switch (code.length) {
			case 8:
				return isValidEAN8(code) ? true : "El código EAN-8 no es válido.";
			case 12:
				return isValidUPC(code) ? true : "El código UPC-A no es válido.";
			case 13:
				return isValidEAN13(code) ? true : "El código EAN-13 no es válido.";
			case 14:
				return isValidGTIN14(code) ? true : "El código GTIN-14 no es válido.";
			default:
				return "El código debe tener de 8 a 14 dígitos.";
		}
	};

	return (
		<FormProvider {...methods}>
			<Box sx={{ p: 3 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
					}}
				>
					<Paper
						elevation={2}
						sx={{
							p: 3,
							borderRadius: 3,
							border: "1px solid rgba(5, 150, 105, 0.15)",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
							<Box
								sx={{
									background:
										"linear-gradient(135deg, #10b981 0%, #059669 100%)",
									borderRadius: 2,
									p: 1,
									display: "flex",
								}}
							>
								<Inventory sx={{ color: "white", fontSize: 24 }} />
							</Box>
							<Typography variant="h6" fontWeight={600}>
								Información del Producto
							</Typography>
						</Box>
						<TextField
							fullWidth
							error={errors.name !== undefined}
							helperText={errors.name?.message}
							id={productName}
							label="Nombre del producto"
							variant="filled"
							required
							{...register("name", {
								required: "Este campo es obligatorio",
							})}
							sx={{ mb: 2 }}
						/>
						<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
							<TextField
								className="w-full"
								error={errors.barcode !== undefined}
								helperText={errors.barcode?.message}
								type="number"
								id={productBarcode}
								label="Codigo de barras"
								variant="filled"
								required
								{...register("barcode", {
									required: "Este campo es obligatorio",
									validate: validateBarcode,
								})}
								fullWidth
							/>
							<TextField
								error={errors.price !== undefined}
								helperText={errors.price?.message}
								id={productPrice}
								label="Precio"
								type="number"
								variant="filled"
								required
								{...register("price", {
									required: "Este campo es obligatorio",
									validate: (value) => value > 0 || "Debe ser mayor de 0",
								})}
								fullWidth
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												{settings.currency === "VES" ? "Bs" : "USD"}
											</InputAdornment>
										),
									},
								}}
							/>
						</Box>
						<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
							<SelectionTextInput
								className="w-full"
								control={control}
								permissions={["create product_categories"]}
								url={route("products.categories")}
								label="Categoria"
								name="category"
							/>

							<SelectionTextInput
								className="w-full"
								control={control}
								permissions={["create product_brands"]}
								url={route("products.brands")}
								label="Marca"
								name="brand"
							/>
						</Box>
						<TextField
							error={false}
							id={productDescription}
							label="Descripcion"
							variant="filled"
							multiline
							rows={4}
							{...register("description")}
							fullWidth
						/>
					</Paper>
					<Paper
						elevation={2}
						sx={{
							p: 3,
							borderRadius: 3,
							border: "1px solid rgba(5, 150, 105, 0.15)",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
							<Box
								sx={{
									background:
										"linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
									borderRadius: 2,
									p: 1,
									display: "flex",
								}}
							>
								<Image sx={{ color: "white", fontSize: 24 }} />
							</Box>
							<Typography variant="h6" fontWeight={600}>
								Imágenes del Producto
							</Typography>
						</Box>
						{errors.images !== undefined && (
							<FormHelperText
								error
								sx={{ textAlign: "center", mb: 2, fontSize: 14 }}
							>
								Es necesario agregar al menos una imagen
							</FormHelperText>
						)}
						<ImageUrlInput />
						<ImageUpload name="images" />
					</Paper>
				</Box>
				<Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
					<Button
						variant="contained"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting}
						sx={{
							background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
							px: 4,
							py: 1.5,
							borderRadius: 2,
							fontWeight: 700,
							textTransform: "none",
							fontSize: 16,
							"&:hover": {
								background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
							},
						}}
					>
						{InitialValues ? "Actualizar Producto" : "Crear Producto"}
					</Button>
				</Box>
			</Box>
		</FormProvider>
	);
}
