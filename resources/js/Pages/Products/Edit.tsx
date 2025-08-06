import { Head, router } from "@inertiajs/react";
import axios, { toFormData } from "axios";
import toast from "react-hot-toast";
import BackButtom from "@/Components/BackButtom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form, { type FormStruture } from "./Partials/Form";

type Props = {
	product: FormStruture;
};

export default function Products({ product }: Props) {
	console.log(product);

	const initialValues = product;

	async function onSubmit(data: FormStruture) {
		try {
			const formData = toFormData(data, new FormData());

			formData.append("_method", "PATCH");
			const response = await axios.post(
				route("products.update", data.id),
				formData,
			);
			toast.success(response.data.message, { duration: 5000 });
			router.visit(route("products.index"));
		} catch (e) {
			console.log(e);
			toast.error(`Error al editar producto: ${e.response.data.message}`);
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
			<Head title="Editar productos" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex mb-3 mx-3">
						<BackButtom />
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<Form onSubmit={onSubmit} InitialValues={initialValues} />
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
