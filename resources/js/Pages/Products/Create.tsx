import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import ImageUpload from "@/Components/ImageUpload";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { isValidUPC, isValidEAN8, isValidEAN13, isValidGTIN14 } from "@/utils";

type Props = {
	products: paginateResponse<Item>;
};

interface FormData extends Item {
	images: File[];
	default: File;
	category: number;
}

export default function Products({ products }: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormData>();

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
				return "El código debe tener 8, 12, 13 o 14 dígitos.";
		}
	};

	async function onSubmit(data: FormData) {
		try {
			await axios.post(route("products.storage"), data);
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
										error={false}
										id="outlined-error-helper-text"
										label="Nombre del producto"
										variant="filled"
										required
										{...register("name", { required: true })}
									/>
									<div className="mt-3 flex gap-3">
										<TextField
											className="w-full"
											error={errors.barcode !== undefined}
                                            helperText={errors.barcode?.message}
											type="number"
											id="outlined-error-helper-text"
											label="Codigo de barras"
											variant="filled"
											required
											{...register("barcode", {
												required: true,
												validate: validateBarcode,
											})}
										/>
										<TextField
											className="w-full"
											error={false}
											id="outlined-error-helper-text"
											label="Precio"
											type="number"
											variant="filled"
											required
											{...register("price", { required: true, min: 0 })}
										/>
									</div>
									<div className="mt-3">
										<FormControl
											variant="filled"
											className="mt-3 w-full"
											required
										>
											<InputLabel id="demo-simple-select-filled-label">
												Categoria
											</InputLabel>
											<Select
												labelId="demo-simple-select-filled-label"
												id="demo-simple-select-filled"
												defaultValue=""
												{...register("category", { required: true })}
											>
												<MenuItem value="">None</MenuItem>
												<MenuItem value={10}>Ten</MenuItem>
												<MenuItem value={20}>Twenty</MenuItem>
												<MenuItem value={30}>Thirty</MenuItem>
											</Select>
										</FormControl>
									</div>
									<div className="mt-3">
										<TextField
											className="w-full"
											error={false}
											id="outlined-error-helper-text"
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
										render={({ fieldState: { error } }) =>
											error && <p>Es necesario una imagen</p>
										}
									/>
									<ImageUpload
										onImagesSelected={(data) => setValue("images", data)}
										onMainImageSelected={(file) => setValue("default", file)}
									/>
								</div>
							</div>
						</div>
						<Button variant="contained" onClick={handleSubmit(onSubmit)}>
							<b>Crear</b>
						</Button>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
