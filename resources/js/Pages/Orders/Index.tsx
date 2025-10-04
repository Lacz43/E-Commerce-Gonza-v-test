import { Head } from "@inertiajs/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IconButton, Tooltip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useCallback, useMemo } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import OrderDetailsModal from "@/Components/OrderDetailsModal";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	orders: paginateResponse<Order>;
	filters: string[];
	sortables: string[];
	statuses: Record<string, string>;
};

export default function OrdersIndex({
	orders,
	filters,
	sortables,
	statuses,
}: Props) {
	const ordersData = orders;
	const { openModal } = useModal();
    console.log(orders.data);

	const handleProcessOrder = useCallback(
		(orderId: number) => {
			openModal(() => <OrderDetailsModal orderId={orderId} />);
		},
		[openModal],
	);

	// Columnas de la tabla
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number" },
			{
				field: "user",
				headerName: "Usuario",
				valueGetter: (_v, r) => r.user?.name ?? "Anónimo",
			},
			{
				field: "user.email",
				headerName: "Email",
				valueGetter: (_v, r) => r.user?.email ?? "Anónimo",
			},
			{
				field: "status",
				headerName: "Estado",
				type: "singleSelect",
				valueOptions: Object.entries(statuses ?? {}).map(([key, value]) => ({
					value: key,
					label: value,
				})),
			},
			{
				field: "total",
				headerName: "Total",
				type: "number",
				valueGetter: (_v, r: Order) =>
					r.order_items?.reduce(
						(sum: number, item: OrderItem) =>
							Number(sum) + Number(item.price) * Number(item.quantity),
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
			{
				field: "actions",
				headerName: "Acciones",
				renderCell: (params) => (
					<div className="flex justify-center">
						<Tooltip title="Procesar">
							<IconButton
								color="success"
								onClick={(e) => {
									e.stopPropagation();
									handleProcessOrder(params.row.id);
								}}
							>
								<CheckCircleIcon />
							</IconButton>
						</Tooltip>
					</div>
				),
			},
		],
		[handleProcessOrder, statuses],
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
									filtersAvailable={filters}
									sortAvailable={sortables}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
