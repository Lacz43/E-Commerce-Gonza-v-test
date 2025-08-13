import { Head, router } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import axios, { AxiosError } from "axios";
import { lazy, Suspense, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import CreateButton from "@/Components/CreateButton";
import ModalDelete from "@/Components/Modals/ModalDelete";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateOrEdit from "./CreateOrEdit";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	users: paginateResponse<User>;
};

export default function Products({ users }: Props) {
	console.log(users);
	const { openModal, closeModal } = useModal();

	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID" },
			{ field: "name", headerName: "Nombre" },
			{ field: "email", headerName: "Correo", width: 200 },
			{
				field: "roles",
				headerName: "Roles",
				valueGetter: (_value, row) =>
					`${row.roles.map((val: { name: string }) => `${val.name}\n`)}`,
			},
			{
				field: "created_at",
				type: "dateTime",
				headerName: "Creado",
				width: 200,
				valueGetter: (_params, row) => {
					const date = new Date(row.created_at);
					return Number.isNaN(date.getTime()) ? null : date;
				},
			},
		],
		[],
	);

	const handleEdit = useCallback((id: number) => {
		modal("edit", id);
	}, []);

	const handleDelete = useCallback(
		(id: number) => {
			openModal(({ closeModal }) => (
				<ModalDelete
					onClose={closeModal}
					id={id}
					title={users.data.find((f) => f.id === id)?.name ?? ""}
					onDeleteConfirm={onDeleteConfig}
				/>
			));
		},
		[users.data],
	);

	const onDeleteConfig = useCallback(
		async (id: number) => {
			try {
				const { data } = await axios.delete(route("users.destroy", id));
				closeModal();
				toast.success(data.message);
				router.reload();
			} catch (e) {
				console.log(e);
				toast.error(
					`Error al eliminar usuario: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
				);
			}
		},
		[users.data],
	);

	const modal = useCallback(
		(type: "create" | "edit", id?: number) =>
			openModal(({ closeModal }) => (
				<CreateOrEdit
					onClose={closeModal}
					type={type}
					user={users.data.find((f) => f.id === id)}
				/>
			)),
		[],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Products
				</h2>
			}
		>
			<Head title="Usuarios" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<CreateButton
							permissions={["create users"]}
							onAction={() => modal("create")}
						/>
					</div>
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense>
								<DataTable
									columns={columns}
									response={users}
									onEdit={{ permissions: ["edit users"], hook: handleEdit }}
									onDelete={{
										permissions: ["delete users"],
										hook: handleDelete,
									}}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
