import { Button, FormHelperText, TextField } from "@mui/material";
import { useEffect, useId } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ImageUpload from "@/Components/ImageUpload";
import ImageUrlInput from "@/Components/Products/ImageUrlInput";
import SelectionTextInput from "@/Components/Products/SelectionTextInput";
import {
	isValidEAN8,
	isValidEAN13,
	isValidGTIN14,
	isValidUPC,
	prepareFiles,
} from "@/utils";

export interface FormStruture
	extends Omit<Item, "images" | "category" | "brand"> {
	images: File[];
	image_used: number | null;
	category: number | string | null;
	brand: number | string | null;
}

type Props = {
	InitialValues?: FormStruture;
	onSubmit: (data: FormStruture) => void;
};

export default function Products({ InitialValues, onSubmit }: Props) {
	const methods = useForm<FormStruture>({
		defaultValues: () => {
			return new Promise<FormStruture>((resolve) => {
				if (InitialValues) {
					prepareFiles(InitialValues.images.map((img) => img.image)).then(
						(files) => {
							resolve({ ...InitialValues, images: files });
						},
					);
				}
			});
		},
	});

	useEffect(() => {
		if (InitialValues) {
			console.log(InitialValues);
			methods.reset({
				...InitialValues,
				image_used: InitialValues.images.findIndex((i) => i.default === 1),
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
			<div className="p-6 text-gray-900">
				<div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
					<div className="">
						<TextField
							className="w-full"
							error={errors.name !== undefined}
							helperText={errors.name?.message}
							id={productName}
							label="Nombre del producto"
							variant="filled"
							required
							{...register("name", {
								required: "Este campo es obligatorio",
							})}
						/>
						<div className="mt-3 flex gap-3">
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
							/>
							<TextField
								className="w-full"
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
							/>
						</div>
						<div className="mt-3 flex gap-3">
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
						</div>
						<div className="mt-3">
							<TextField
								className="w-full"
								error={false}
								id={productDescription}
								label="Descripcion"
								variant="filled"
								multiline
								{...register("description")}
							/>
						</div>
					</div>
					<div className="">
						<Controller
							name="images"
							control={control}
							rules={{ required: true }}
							render={({ fieldState: { error } }) => (
								<>
									{error && (
										<FormHelperText className="red text-center">
											Es necesario una imagen
										</FormHelperText>
									)}
									<ImageUrlInput />
									<ImageUpload name="images" />
								</>
							)}
						/>
					</div>
				</div>
			</div>
			<Button
				variant="contained"
				onClick={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			>
				<b>{InitialValues ? "Editar" : "Crear"}</b>
			</Button>
		</FormProvider>
	);
}
