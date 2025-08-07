import { Head, router } from "@inertiajs/react";
import axios, { AxiosError, toFormData } from "axios";
import toast from "react-hot-toast";
import BackButtom from "@/Components/BackButtom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form, { type FormStruture } from "./Partials/Form";

export default function Products() {
	async function onSubmit(data: FormStruture) {
		try {
			const formData = toFormData(data, new FormData());
			const response = await axios.post(route("products.storage"), formData);
			toast.success(response.data.message, { duration: 5000 });
			router.visit(route("products.index"));
		} catch (e) {
			console.log(e);
			toast.error(`Error al registrar producto: ${e instanceof AxiosError ? e.response?.data.message : ""}`);
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
						<BackButtom />
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<Form onSubmit={onSubmit} />
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
