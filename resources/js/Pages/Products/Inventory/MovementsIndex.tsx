import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ModalMovementDetail from "./Partials/ModalMovementDetail";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	movements: paginateResponse<MovementItem>;
	modelsName: Record<string, string>;
	filtersAvailable: string[];
	sortAvailable: string[];
};

export default function MovementsIndex({
	movements,
	modelsName,
	filtersAvailable,
	sortAvailable,
}: Props) {
	const [movementsData, setMovementsData] = useState(movements);
	const { openModal } = useModal();

	useEffect(() => {
		setMovementsData(movements);
	}, [movements]);

	const handleRowClick = useCallback(
		async (row: MovementItem) => {
			try {
				const { data } = await axios.get(
					route("inventory.movements.show", row.id),
				);
				openModal(({ closeModal }) => (
					<ModalMovementDetail
						data={data}
						modelsName={modelsName}
						onClose={closeModal}
					/>
				));
			} catch {
				console.error("Error al cargar los detalles del movimiento");
			}
		},
		[modelsName, openModal],
	);

	// Columnas de la tabla
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number", width: 80 },
			{
				field: "product_inventory.product.name",
				headerName: "Producto",
				valueGetter: (_v, r) => r.product_inventory?.product?.name ?? "",
			},
			{
				field: "barcode",
				headerName: "Código",
				valueGetter: (_v, r) => r.product_inventory?.product?.barcode ?? "",
			},
			{
				field: "quantity",
				headerName: "Cantidad",
				type: "number",
			},
			{
				field: "previous_stock",
				headerName: "Antes",
				type: "number",
			},
			{
				field: "after",
				headerName: "Después",
				type: "number",
				valueGetter: (_v, r) => r.previous_stock + r.quantity,
			},
			{
				field: "type",
				headerName: "Tipo",
				type: "singleSelect",
				valueOptions: [
					{ label: "Entrada", value: "ingress" },
					{ label: "Salida", value: "egress" },
				],
			},
			{
				field: "user.name",
				headerName: "Usuario",
				valueGetter: (_v, r) => r.user?.name ?? "",
			},
			{
				field: "created_at",
				headerName: "Fecha",
				width: 180,
				type: "dateTime",
				valueGetter: (_params, row) => {
					const date = new Date(row.created_at);
					return Number.isNaN(date.getTime()) ? null : date;
				},
			},
			{
				field: "model_type",
				headerName: "Origen",
				type: "singleSelect",
				valueOptions: Object.entries(modelsName ?? {}).map(([key, label]) => ({
					label,
					value: `App\\Models\\${key}`,
				})),
			},
		],
		[modelsName],
	);

	const onViewConfig = useMemo(
		() => ({
			permissions: ["show product_inventory"],
			hook: (id: number) => {
				const movement = movementsData.data.find((m) => m.id === id);
				if (movement) {
					handleRowClick(movement);
				}
			},
		}),
		[handleRowClick, movementsData.data],
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
									filtersAvailable={filtersAvailable}
									sortAvailable={sortAvailable}
									onShow={onViewConfig}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
