import { Button, FormHelperText, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ImageUpload from "@/Components/ImageUpload";
import ImageUrlInput from "@/Components/Products/ImageUrlInput";
import SelectionTextInput from "@/Components/Products/SelectionTextInput";
import { isValidEAN8, isValidEAN13, isValidGTIN14, isValidUPC } from "@/utils";

export interface FormStruture extends Item {
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
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>({
		defaultValues: InitialValues ?? {},
	});

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
		<>
			<div className="p-6 text-gray-900">
				<div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
					<div className="">
						<TextField
							className="w-full"
							error={errors.name !== undefined}
							helperText={errors.name?.message}
							id="product_name"
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
								id="product_barcode"
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
								id="product_price"
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
								id="product_description"
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
							render={({ field: { onChange }, fieldState: { error } }) => {
								const [newImage, addNewImage] = useState<File[]>([]);
								return (
									<>
										{error && (
											<FormHelperText className="red text-center">
												Es necesario una imagen
											</FormHelperText>
										)}
										<ImageUrlInput
											imageResponse={(image) => addNewImage([image])}
										/>
										<ImageUpload
											setImagesInit={
												InitialValues?.images.map(
													(image) => image.image,
												) as string[]
											}
											defaultImage={InitialValues?.images.findIndex(
												(image) => image.default === 1,
											)}
											appendImages={newImage}
											onImagesSelected={(data) => onChange(data)}
											onMainImageSelected={(index) =>
												setValue("image_used", index)
											}
										/>
									</>
								);
							}}
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
		</>
	);
}
