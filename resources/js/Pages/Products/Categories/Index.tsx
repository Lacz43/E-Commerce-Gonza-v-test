import DataTable from "@/Components/DataTable";
import PermissionGate from "@/Components/PermissionGate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@mui/material";

type Props = {
	categories: paginateResponse<Item>;
};

export default function Products({ categories }: Props) {
	console.log(categories);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
				    Categoria de Productos
				</h2>
			}
		>
			<Head title="Categorias" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<PermissionGate permission={["create product_categories"]}>
							<Link href={route("products.create")}>
								<Button variant="contained" size="small">
									<b>Nuevo</b>
								</Button>
							</Link>
						</PermissionGate>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<DataTable<Item>
								columns={[
									{ field: "id", headerName: "ID" },
									{ field: "name", headerName: "Categoria" },
								]}
								response={categories}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
