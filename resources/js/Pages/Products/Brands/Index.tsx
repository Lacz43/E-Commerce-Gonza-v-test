import { Head, router } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import axios, { AxiosError } from "axios";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CreateButton from "@/Components/CreateButton";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal, { type ModalType } from "./Partials/Modal";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/Modals/ModalDelete"));

type Props = {
	brands: paginateResponse<Item>;
	filtersFields: string[];
	sortFields: string[];
};

export default function Brands({ brands, filtersFields, sortFields }: Props) {
	console.log(brands);
	const { openModal, closeModal } = useModal();

	const [loading, setLoading] = useState(false);

	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID" },
			{ field: "name", headerName: "Marca" },
		],
		[],
	);

	const HandleDelete = useCallback(
		async (id: number) => {
			setLoading(true);
			try {
				const { data } = await axios.delete(
					route("products.brands.delete", id),
				);
				setLoading(false);
				closeModal();
				router.reload({ showProgress: true });
				toast.success(data.message);
			} catch (e) {
				console.log(e);
				toast.error(
					`Error al eliminar marca: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
				);
			}
		},
		[closeModal],
	);

	const handleDeleteClick = useCallback(
		(id: number) =>
			openModal(({ closeModal }) => (
				<ModalDelete
					id={id}
					title={brands.data.find((f) => f.id === id)?.name ?? ""}
					onDeleteConfirm={HandleDelete}
					onClose={closeModal}
					loading={loading}
				/>
			)),
		[brands.data, HandleDelete, loading, openModal],
	);

	const onDeleteConfig = useMemo(
		() => ({
			permissions: ["delete product_brands"],
			hook: handleDeleteClick,
		}),
		[handleDeleteClick],
	);

	const handleModalCrateOrEdit = useCallback(
		(prop: ModalType) => {
			openModal(({ closeModal }) => (
				<Modal
					openModal={prop}
					name={brands.data.find((f) => f.id === prop.id)?.name ?? ""}
					onClose={closeModal}
				/>
			));
		},
		[brands.data, openModal],
	);

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit product_brands"],
			hook: (id: number) => {
				handleModalCrateOrEdit({ type: "edit", id });
			},
		}),
		[handleModalCrateOrEdit],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Marcas de Productos
				</h2>
			}
		>
			<Head title="Marcas" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<CreateButton
							permissions={["create product_brands"]}
							onAction={() => handleModalCrateOrEdit({ type: "create" })}
						/>
					</div>
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
									response={brands}
									columns={columns}
									filtersAvailable={filtersFields}
									sortAvailable={sortFields}
									onDelete={onDeleteConfig}
									onEdit={onEditConfig}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
