import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import CreateButton from "@/Components/CreateButton";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "./Partials/ModalEdit";

const DataTable = lazy(() => import("@/Components/DataTable"));

type InventoryItem = Item & { stock?: number };

type Props = { products: paginateResponse<InventoryItem> };

export default function InventoryIndex({ products }: Props) {
	const { openModal, closeModal } = useModal();
	const [inventory, setInventory] = useState(products);
	console.log("Inventory:", inventory);

	useEffect(() => {
		setInventory(products);
	}, [products]);

	// Columnas de la tabla (useMemo interno en lugar de wrapper externo)
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number" },
			{ field: "name", headerName: "Producto" },
			{ field: "barcode", headerName: "Código de Barras" },
			{
				field: "product_inventory",
				headerName: "Cantidad",
				type: "number",
				width: 120,
				valueGetter: (_v, r) => r.product_inventory?.stock ?? 0,
			},
		],
		[],
	);

	const openModalEdit = useCallback(
		(id?: number) => {
			openModal(({ closeModal }) => <Modal onClose={closeModal} id={id} />);
		},
		[openModal],
	);

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit products"],
			hook: (id: number) => openModalEdit(id),
		}),
		[openModalEdit],
	);

	const onShowConfig = useMemo(
		() => ({
			permissions: ["show products"],
			hook: (id: number) => console.log("Show inventory product", id),
		}),
		[],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Inventario
				</h2>
			}
		>
			<Head title="Inventario" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<CreateButton
							permissions={["create products"]}
							onAction={() => openModalEdit()}
						/>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense
								fallback={
									<DataTableSkeleton
										columns={columns.length + 1}
										rows={10}
										showToolbar={false}
									/>
								}
							>
								<DataTable
									response={inventory}
									columns={columns}
									fill
									filtersAvailable={["name"]}
									sortAvailable={["id", "name", "stock"]}
									onEdit={onEditConfig}
									onShow={onShowConfig}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
