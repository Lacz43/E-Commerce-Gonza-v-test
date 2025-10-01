import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useMemo } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Session = {
	id: string;
	user_id: number;
	ip_address: string;
	user_agent: string;
	last_activity: string;
	user?: {
		name: string;
	};
};

type Props = {
	sessions: paginateResponse<Session>;
	filtersAvailable: string[];
	sortAvailable: string[];
};

export default function Index({
	sessions,
	filtersAvailable,
	sortAvailable,
}: Props) {
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", width: 200 },
			{
				field: "user.name",
				headerName: "Usuario",
				width: 150,
				valueGetter: (_value, row) => row.user?.name ?? "",
			},
			{
				field: "ip_address",
				headerName: "Dirección IP",
				width: 150,
			},
			{
				field: "user_agent",
				headerName: "Agente de Usuario",
				width: 300,
			},
			{
				field: "last_activity",
				type: "dateTime",
				headerName: "Última Actividad",
				width: 180,
				valueGetter: (_params, row) => {
					const date = new Date(row.last_activity);
					return Number.isNaN(date.getTime()) ? null : date;
				},
			},
		],
		[],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Sesiones de Usuario
				</h2>
			}
		>
			<Head title="Sesiones de Usuario" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
									columns={columns}
									response={sessions}
									fill
									filtersAvailable={filtersAvailable}
									sortAvailable={sortAvailable}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
