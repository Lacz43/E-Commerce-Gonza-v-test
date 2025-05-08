import DataTable from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

type Props = {
	products: paginateResponse<Item>;
};

export default function Products({ products }: Props) {
	console.log(products);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Products
				</h2>
			}
		>
			<Head title="Productos" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<DataTable<Item>
								columns={[
									{ field: "id", headerName: "ID" },
									{ field: "name", headerName: "Producto" },
									{
										field: "barcode",
										headerName: "Codigo de barras",
										width: 150,
									},
									{
										field: "price",
										headerName: "Precio",
										valueGetter: (_value, row) => `${row.price} $`,
									},
									{ field: "description", headerName: "Descripción" },
								]}
								response={products}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
