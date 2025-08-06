import { Head, router } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import {
	lazy,
	memo,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import CreateButton from "@/Components/CreateButton";
import type { tableProps } from "@/Components/DataTable";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/Modals/ModalDelete"));

type Props = {
	products: paginateResponse<Item>;
	filtersFields: string[];
	sortFields: string[];
};

const WrapperDataTable = memo((props: Omit<tableProps<Item>, "columns">) => {
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number" },
			{ field: "name", headerName: "Producto" },
			{
				field: "barcode",
				headerName: "Codigo de barras",
				width: 150,
			},
			{
				field: "price",
				type: "number",
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
	return (
		<Suspense fallback={<div>Esperando...</div>}>
			<DataTable {...props} columns={columns} />
		</Suspense>
	);
});

export default function Products({
	products,
	filtersFields,
	sortFields,
}: Props) {
	const { openModal, closeModal } = useModal();
	const [product, setProduct] = useState(products);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setProduct(products);
	}, [products]);

	async function HandleDelete(id: number) {
		setLoading(true);
		try {
			axios.delete(route("products.delete", id));
			setLoading(false);
            closeModal();
			setProduct((prev) => ({
				...prev,
				data: prev.data.filter((item) => item.id !== id),
			}));
		} catch (e) {
			console.log(e);
		}
	}

	const handleDeleteClick = useCallback(
		(id: number) =>
			openModal(({ closeModal }) => (
				<ModalDelete
					onClose={closeModal}
					id={id}
					loading={loading}
					title={products.data.find((f) => f.id === id)?.name ?? ""}
					onDeleteConfirm={HandleDelete}
				/>
			)),
		[],
	);

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit products"],
			hook: (id: number) => router.visit(route("products.edit", id)),
		}),
		[],
	);

	const onShowConfig = useMemo(
		() => ({
			permissions: ["show products"],
			hook: (id: number) => console.log("Show:", id),
		}),
		[],
	);

	const onDeleteConfig = useMemo(
		() => ({
			permissions: ["delete products"],
			hook: handleDeleteClick,
		}),
		[handleDeleteClick],
	);

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
						<CreateButton
							permissions={["create products"]}
							onAction={() => router.visit(route("products.create"))}
						/>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<WrapperDataTable
								response={product}
								filtersAvailable={filtersFields}
								sortAvailable={sortFields}
								onEdit={onEditConfig}
								onDelete={onDeleteConfig}
								onShow={onShowConfig}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
