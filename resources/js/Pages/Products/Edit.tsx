import { Head } from "@inertiajs/react";
import BackButtom from "@/Components/BackButtom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Partials/Form";

type Props = {
	product: Item;
};

export default function Products({ product }: Props) {
	console.log(product);

	const initialValues = product;

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
						<Form InitialValues={initialValues} />
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
