import { Head, router } from "@inertiajs/react";
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
import toast from "react-hot-toast";
import CreateButton from "@/Components/CreateButton";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/Modals/ModalDelete"));

type InventoryItem = Item & { stock?: number };

type Props = { products: paginateResponse<InventoryItem> };

export default function InventoryIndex({ products }: Props) {
	const { openModal, closeModal } = useModal();
	const [inventory, setInventory] = useState(products);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setInventory(products);
	}, [products]);

	const handleDelete = useCallback(
		async (id: number) => {
			setLoading(true);
			try {
				await axios.delete(route("inventory.delete", id));
				setInventory((prev) => ({
					...prev,
					data: prev.data.filter((p) => p.id !== id),
				}));
				toast.success("Producto removido del inventario");
				closeModal();
			} catch (e) {
				console.error(e);
				toast.error("Error al eliminar del inventario");
			} finally {
				setLoading(false);
			}
		},
		[closeModal],
	);

	// Columnas de la tabla (useMemo interno en lugar de wrapper externo)
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number"},
			{ field: "name", headerName: "Producto" },
            { field: "barcode", headerName: "Código de Barras"},
			{
				field: "stock",
				headerName: "Cantidad",
				type: "number",
				width: 120,
				valueGetter: (_v, r) => r.stock ?? 0,
			},
		],
		[],
	);

	const onDeleteConfig = useMemo(
		() => ({
			permissions: ["delete products"],
			hook: (id: number) =>
				openModal(({ closeModal }) => (
					<ModalDelete
						id={id}
						title={inventory.data.find((f) => f.id === id)?.name || ""}
						loading={loading}
						onDeleteConfirm={handleDelete}
						onClose={closeModal}
					/>
				)),
		}),
		[inventory, loading, openModal, handleDelete],
	);

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit products"],
			hook: (id: number) => router.visit(route("inventory.edit", id)),
		}),
		[],
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
							onAction={() => router.visit(route("products.create"))}
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
									onDelete={onDeleteConfig}
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
