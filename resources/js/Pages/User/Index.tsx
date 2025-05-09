import DataTable from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { formatDate } from "@/utils";

type Props = {
	users: paginateResponse<User>;
};

export default function Products({ users }: Props) {
	console.log(users);
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
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<DataTable<User>
								columns={[
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
										headerName: "Creado",
										width: 200,
										valueGetter: (value, _row) => `${formatDate(value)}`,
									},
								]}
								response={users}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
