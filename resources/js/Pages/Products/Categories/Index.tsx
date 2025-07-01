import { Head } from "@inertiajs/react";
import { Button } from "@mui/material";
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
import type { tableProps } from "@/Components/DataTable";
import PermissionGate from "@/Components/PermissionGate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { ModalType } from "./Partials/Modal";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/Modals/ModalDelete"));
const Modal = lazy(() => import("./Partials/Modal"));

type Props = {
	categories: paginateResponse<Item>;
};
const WrapperDataTable = memo((props: Omit<tableProps<Item>, "columns">) => {
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID" },
			{ field: "name", headerName: "Categoria" },
		],
		[],
	);
	return (
		<Suspense fallback={<div>Esperando...</div>}>
			<DataTable {...props} columns={columns} />
		</Suspense>
	);
});

export default function Products({ categories }: Props) {
	console.log(categories);
	const [category, setCategory] = useState(categories);
	const [selected, setSelect] = useState<null | number>(null);
	const [openModal, setOpenModal] = useState<ModalType | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setCategory(categories);
	}, [categories]);

	const handleDeleteClick = useCallback((id: number) => setSelect(id), []);

	const onDeleteConfig = useMemo(
		() => ({
			permissions: ["delete product_categories"],
			hook: handleDeleteClick,
		}),
		[handleDeleteClick],
	);

	async function HandleDelete(id: number) {
		setLoading(true);
		try {
			axios.delete(route("products.categories.delete", id));
			setLoading(false);
			setSelect(null);
			setCategory((prev) => ({
				...prev,
				data: prev.data.filter((item) => item.id !== id),
			}));
		} catch (e) {
			console.log(e);
		}
	}

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit product_categories"],
			hook: (id: number) =>
				setOpenModal({
					type: "edit",
					name: category.data.find((f) => f.id === id)?.name ?? "",
					id,
				}),
		}),
		[],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Categoria de Productos
				</h2>
			}
		>
			<Head title="Categorias" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<PermissionGate permission={["create product_categories"]}>
							<Button variant="contained" size="small" onClick={() => setOpenModal({ type: "create" })}>
								<b>Nuevo</b>
							</Button>
						</PermissionGate>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<WrapperDataTable
								response={category}
								onDelete={onDeleteConfig}
								onEdit={onEditConfig}
							/>
						</div>
					</div>
				</div>
			</div>
			<Suspense>
				<ModalDelete
					show={selected !== null}
					setOpen={() => setSelect(null)}
					id={selected}
					loading={loading}
					title={categories.data.find((f) => f.id === selected)?.name ?? ""}
					onDeleteConfirm={HandleDelete}
				/>
			</Suspense>
			<Suspense>
				<Modal openModal={openModal} setOpenModal={setOpenModal} />
			</Suspense>
		</AuthenticatedLayout>
	);
}
