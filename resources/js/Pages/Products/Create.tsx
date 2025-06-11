import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button, TextField, FormHelperText } from "@mui/material";
import ImageUpload from "@/Components/ImageUpload";
import SelectionTextInput from "@/Components/Products/SelectionTextInput";
import ImageUrlInput from "@/Components/Products/ImageUrlInput";
import { useForm, Controller } from "react-hook-form";
import axios, { toFormData } from "axios";
import { isValidUPC, isValidEAN8, isValidEAN13, isValidGTIN14 } from "@/utils";
import { useState } from "react";

type Props = {
	products: paginateResponse<Item>;
};

interface FormStruture extends Item {
	images: File[];
	image_used: number | null;
	category: number | string | null;
	brand: number | string | null;
}

export default function Products({ products }: Props) {
	const [newImage, addNewImage] = useState<File[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	const validateBarcode = (value: string) => {
		const code = value.trim();
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

	async function onSubmit(data: FormStruture) {
		try {
			const formData = new FormData();
			toFormData(data, formData);
			await axios.post(route("products.storage"), formData);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Products
				</h2>
			}
		>
			<Head title="Registrar productos" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex mb-3 mx-3">
						<Button variant="contained" size="small">
							<b>Atras</b>
						</Button>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
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
											label="Cateria"
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
										render={({ fieldState: { error } }) => (
											<>
												{error ? (
													<FormHelperText className="red text-center">
														Es necesario una imagen
													</FormHelperText>
												) : null}
											</>
										)}
									/>
									<ImageUrlInput
										imageResponse={(image) => addNewImage([image])}
									/>
									<ImageUpload
										appendImages={newImage}
										onImagesSelected={(data) => setValue("images", data)}
										onMainImageSelected={(index) =>
											setValue("image_used", index)
										}
									/>
								</div>
							</div>
						</div>
						<Button
							variant="contained"
							onClick={handleSubmit(onSubmit)}
							disabled={isSubmitting}
						>
							<b>Crear</b>
						</Button>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
