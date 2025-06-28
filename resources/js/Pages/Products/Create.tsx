import { Head } from "@inertiajs/react";
import { Button } from "@mui/material";
import axios, { toFormData } from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form, {type FormStruture } from "./Partials/Form";

export default function Products() {
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
						<Form onSubmit={onSubmit} />
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
