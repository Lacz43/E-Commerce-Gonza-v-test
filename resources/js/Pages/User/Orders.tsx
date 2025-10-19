import { Head } from "@inertiajs/react";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useCallback, useMemo } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import PageHeader from "@/Components/PageHeader";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	orders: Order[];
};

export default function UserOrders({ orders }: Props) {
	const { openModal } = useModal();
	const { settings } = useGeneralSettings();

	const handleProcessOrder = useCallback(
		(orderId: number) => {
			openModal(() => <>{orderId}</>);
		},
		[openModal],
	);

	// Columnas simplificadas para usuarios
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", width: 80 },
			{
				field: "status",
				headerName: "Estado",
				renderCell: (params) => {
					const status = params.value as string;
					const getStatusColor = (status: string) => {
						switch (status.toLowerCase()) {
							case "pending":
								return "bg-yellow-100 text-yellow-800";
							case "processing":
								return "bg-blue-100 text-blue-800";
							case "shipped":
								return "bg-purple-100 text-purple-800";
							case "delivered":
								return "bg-green-100 text-green-800";
							case "cancelled":
								return "bg-red-100 text-red-800";
							default:
								return "bg-gray-100 text-gray-800";
						}
					};

					const getStatusLabel = (status: string) => {
						const labels: Record<string, string> = {
							pending: "Pendiente",
							processing: "En Proceso",
							shipped: "Enviado",
							delivered: "Entregado",
							cancelled: "Cancelado",
						};
						return labels[status.toLowerCase()] || status;
					};

					return (
						<span
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
						>
							{getStatusLabel(status)}
						</span>
					);
				},
			},
			{
				field: "total",
				headerName: "Total",
				valueGetter: (_v, r: Order) =>
					r.order_items?.reduce(
						(sum: number, item: OrderItem) =>
							Number(sum) + Number(item.price) * Number(item.quantity),
						0,
					) ?? 0,
				valueFormatter: (value: number) =>
					`${settings.currency === "VES" ? "Bs" : "$"} ${value.toFixed(2)}`,
			},
			{
				field: "created_at",
				headerName: "Fecha",
				valueGetter: (_v, r) => new Date(r.created_at),
			},
			{
				field: "actions",
				headerName: "Acciones",
				renderCell: (params) => (
					<button
						type="button"
						onClick={() => handleProcessOrder(params.row.id)}
						className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
					>
						Ver Detalles
					</button>
				),
			},
		],
		[handleProcessOrder],
	);

	return (
		<AuthenticatedLayout>
			<Head title="Mis Pedidos" />
			<PageHeader
				title="Mis Pedidos"
				icon={ReceiptIcon}
				subtitle="Seguimiento completo de tus órdenes y estado de entregas"
			/>
			<div className="flex flex-col gap-6">
				{/* Estadísticas de pedidos */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Total de pedidos */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total de pedidos
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{orders.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<svg
									className="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Icono de pedidos totales"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Pedidos pendientes */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Pendientes</p>
								<p className="text-2xl font-bold text-yellow-600">
									{
										orders.filter(
											(order) => order.status?.toLowerCase() === "pending",
										).length
									}
								</p>
							</div>
							<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
								<svg
									className="w-6 h-6 text-yellow-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Icono de pedidos pendientes"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Pedidos entregados */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Entregados</p>
								<p className="text-2xl font-bold text-green-600">
									{
										orders.filter(
											(order) => order.status?.toLowerCase() === "delivered",
										).length
									}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Icono de pedidos entregados"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>

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
									response={{
										data: orders,
										current_page: 1,
										last_page: 1,
										per_page: orders.length,
										total: orders.length,
									}}
									columns={columns}
									fill
									filtersAvailable={[]}
									sortAvailable={[]}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
