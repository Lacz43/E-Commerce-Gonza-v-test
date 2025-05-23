import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@mui/material";

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
			<Head title="Registrar product" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex mb-3">
						<Button variant="contained" size="small"><b>Atras</b></Button>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
