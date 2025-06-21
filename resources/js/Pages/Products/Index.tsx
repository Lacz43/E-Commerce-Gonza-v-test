import { Head, Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import PermissionGate from "@/Components/PermissionGate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import routerAsync from "@/Hook/routerAsync";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/ModalDelete"));

type Props = {
	products: paginateResponse<Item>;
};

export default function Products({ products }: Props) {
	console.log(products);
	const [selected, setSelect] = useState<null | number>(null);

	async function HandleDelete(id: number) {
		try {
			routerAsync("delete", route("products.delete", id));
		} catch (e) {
			console.log(e);
		}
	}

	const columns = useMemo<GridColDef[]>(
		() => [
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
			{
				field: "description",
				headerName: "Descripción",
				width: 300,
			},
		],
		[],
	);

	const handleDeleteClick = useCallback((id: number) => console.log(id), []);

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
					<div className="flex justify-end mb-3 mx-3">
						<PermissionGate permission={["create products"]}>
							<Link href={route("products.create")}>
								<Button variant="contained" size="small">
									<b>Nuevo</b>
								</Button>
							</Link>
						</PermissionGate>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense fallback={<div>Esperando...</div>}>
								<DataTable
									columns={columns}
									response={products}
									onEdit={{
										permissions: ["edit products"],
										hook: (id) => console.log(id),
									}}
									onDelete={{
										permissions: ["delete products"],
										hook: handleDeleteClick,
									}}
									onShow={{
										permissions: ["show products"],
										hook: (id) => console.log(id),
									}}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
			<ModalDelete
				show={selected !== null}
				setOpen={() => setSelect(null)}
				id={selected}
				title={products.data.find((f) => f.id === selected)?.name ?? ""}
				onDeleteConfirm={(id) => HandleDelete(id)}
			/>
		</AuthenticatedLayout>
	);
}
