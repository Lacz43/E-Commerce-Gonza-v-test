import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import CreateButton from "@/Components/CreateButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateOrEdit from "./CreateOrEdit";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Props = {
	users: paginateResponse<User>;
};

export default function Products({ users }: Props) {
	console.log(users);
	const [open, setOpen] = useState<"create" | "edit" | undefined>();

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
		console.log(id);
		setOpen("edit");
	}, []);

	const handleDelete = useCallback((id: number) => {
		console.log(id);
	}, []);

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
							onAction={() => setOpen("create")}
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
			<CreateOrEdit
				show={open !== undefined}
				onClose={() => setOpen(undefined)}
				type={open ?? "create"}
			/>
		</AuthenticatedLayout>
	);
}
