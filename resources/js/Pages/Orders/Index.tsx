import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useMemo } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = { orders: paginateResponse<Order> };

export default function OrdersIndex({ orders }: Props) {
	const ordersData = orders;

	// Columnas de la tabla
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number" },
			{
				field: "user",
				headerName: "Usuario",
				valueGetter: (_v, r) => r.user?.name ?? "Anónimo",
			},
			{ field: "status", headerName: "Estado" },
			{
				field: "total",
				headerName: "Total",
				type: "number",
				valueGetter: (_v, r: Order) =>
					r.order_items?.reduce(
						(sum: number, item: OrderItem) => Number(sum) + Number(item.price) * Number(item.quantity),
						0,
					) ?? 0,
				valueFormatter: (value: number) => `$ ${value.toFixed(2)}`,
			},
			{
				field: "created_at",
				headerName: "Fecha",
				type: "dateTime",
				valueGetter: (_v, r) => new Date(r.created_at),
			},
		],
		[],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Pedidos
				</h2>
			}
		>
			<Head title="Pedidos" />
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
									response={ordersData}
									columns={columns}
									fill
									filtersAvailable={["user"]}
									sortAvailable={["id", "status", "created_at"]}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
