import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	movements: paginateResponse<MovementItem>;
	modelsName: Record<string, string>;
};

export default function MovementsIndex({ movements, modelsName }: Props) {
	const [movementsData, setMovementsData] = useState(movements);

	useEffect(() => {
		setMovementsData(movements);
	}, [movements]);

	// Columnas de la tabla
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number", width: 80 },
			{
				field: "product_inventory.product.name",
				headerName: "Producto",
				width: 200,
				valueGetter: (_v, r) => r.product_inventory?.product?.name ?? "",
			},
			{
				field: "barcode",
				headerName: "Código",
				width: 150,
				valueGetter: (_v, r) => r.product_inventory?.product?.barcode ?? "",
			},
			{
				field: "quantity",
				headerName: "Cantidad",
				type: "number",
				width: 100,
			},
			{
				field: "type",
				headerName: "Tipo",
				width: 100,
				type: "singleSelect",
				valueOptions: [
					{ label: "Entrada", value: "ingress" },
					{ label: "Salida", value: "egress" },
				],
			},
			{
				field: "user.name",
				headerName: "Usuario",
				width: 150,
				valueGetter: (_v, r) => r.user?.name ?? "",
			},
			{
				field: "created_at",
				headerName: "Fecha",
				width: 180,
				valueGetter: (_v, r) => new Date(r.created_at).toLocaleString(),
			},
			{
				field: "model_type",
				headerName: "Origen",
				width: 150,
				type: "singleSelect",
				valueOptions: Object.entries(modelsName ?? {}).map(([key, label]) => ({
					label,
					value: `App\\Models\\${key}`,
				})),
			},
		],
		[modelsName],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Historial de Movimientos
				</h2>
			}
		>
			<Head title="Historial de Movimientos" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense
								fallback={
									<DataTableSkeleton
										columns={columns.length}
										rows={10}
										showToolbar={false}
									/>
								}
							>
								<DataTable
									response={movementsData}
									columns={columns}
									fill
									filtersAvailable={[
										"product_inventory.product.name",
										"user.name",
										"type",
										"model_type",
									]}
									sortAvailable={["id", "created_at", "quantity", "type"]}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
