import { Head } from "@inertiajs/react";
import type { GridColDef } from "@mui/x-data-grid";
import { lazy, Suspense, useMemo } from "react";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type Activity = {
	id: number;
	description: string;
	event: string;
	causer?: {
		name: string;
	};
	subject_type?: string;
	created_at: string;
};

type Props = {
	activities: paginateResponse<Activity>;
	filtersAvailable: string[];
	sortAvailable: string[];
};

export default function Index({
	activities,
	filtersAvailable,
	sortAvailable,
}: Props) {
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID", width: 80 },
			{ field: "description", headerName: "Descripción", width: 300 },
			{ field: "event", headerName: "Evento", width: 100 },
			{
				field: "causer.name",
				headerName: "Usuario",
				width: 150,
				valueGetter: (_value, row) => row.causer?.name ?? "",
			},
			{
				field: "subject_type",
				headerName: "Tipo de Sujeto",
				width: 200,
				valueGetter: (_value, row) => row.subject_type ?? "",
			},
			{
				field: "created_at",
				type: "dateTime",
				headerName: "Fecha",
				width: 180,
				valueGetter: (_params, row) => {
					const date = new Date(row.created_at);
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
					Bitácora de Usuario
				</h2>
			}
		>
			<Head title="Bitácora de Usuario" />

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
									response={activities}
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
