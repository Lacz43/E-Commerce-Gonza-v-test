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
import ImageUpload from "@/Components/ImageUpload"

type Props = {
	products: paginateResponse<Item>;
};

export default function Products({ products }: Props) {
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
									/>
									<div className="mt-3 flex gap-3">
										<TextField
											className="w-full"
											error={false}
											type="number"
											id="outlined-error-helper-text"
											label="Codigo de barras"
											variant="filled"
											required
										/>
										<TextField
											className="w-full"
											error={false}
											id="outlined-error-helper-text"
											label="Precio"
											type="number"
											variant="filled"
											required
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
											>
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
										/>
									</div>
								</div>
								<div className="">
                                    <ImageUpload />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
