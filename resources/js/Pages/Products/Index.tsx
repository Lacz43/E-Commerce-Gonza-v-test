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
import { imageUrl } from "@/utils";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/Modals/ModalDelete"));

const renderImageCell = (params: { row: Item }) => (
	<img
		src={
			params.row.default_image?.image
				? imageUrl(params.row.default_image.image)
				: "/placeholder-product.png"
		}
		alt={params.row.name}
		style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
		loading="lazy"
	/>
);

type Props = {
	products: paginateResponse<Item>;
	filtersFields: string[];
	sortFields: string[];
};

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
		console.log(products);
	}, [products]);

	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", type: "number" },
			{
				field: "default_image",
				headerName: "Imagen",
				width: 100,
				renderCell: renderImageCell,
			},
			{ field: "name", headerName: "Producto" },
			{
				field: "barcode",
				headerName: "Codigo de barras",
				width: 150,
			},
			{
				field: "price",
				type: "number",
				width: 100,
				headerName: "Precio",
				valueGetter: (_value, row) => `${row.price} $`,
			},
			{
				field: "description",
				headerName: "Descripción",
			},
		],
		[],
	);

	const HandleDelete = useCallback(
		async (id: number) => {
			setLoading(true);
			try {
				await axios.delete(route("products.delete", id));
				setLoading(false);
				closeModal();
				toast.success("Producto eliminado exitosamente");
				setProduct((prev) => ({
					...prev,
					data: prev.data.filter((item) => item.id !== id),
				}));
			} catch (e) {
				console.log(e);
				toast.error(`Error al eliminar producto: ${e}`);
			}
		},
		[closeModal],
	);

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
		[openModal, loading, products.data, HandleDelete],
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
									response={product}
									columns={columns}
									fill
									filtersAvailable={filtersFields}
									sortAvailable={sortFields}
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
