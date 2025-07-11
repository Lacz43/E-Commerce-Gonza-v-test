import { Head } from "@inertiajs/react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { lazy, Suspense } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type BackupAndRestore = {
	name: string;
	size: number;
	lastModified: string;
	url: string;
};

type Props = {
	backups: paginateResponse<BackupAndRestore>;
};

export default function BackupAndRestore({ backups }: Props) {
	console.log(backups);
	const Columns: GridColDef[] = [
		{ field: "name", headerName: "Nombre", width: 200 },
		{
			field: "size",
			headerName: "Tamaño",
			type: "number",
			valueGetter: (value) => `${(Number(value) / 1024).toFixed(2)} KB`,
		},
		{
			field: "lastModified",
			headerName: "Modificado",
			type: "dateTime",
            width: 200,
			valueGetter: (value) =>
				new Date(format(value * 1000, "dd/MM/yyyy HH:mm:ss")),
		},
		{
			field: "url",
			headerName: "Acciones",
			type: "actions",
			renderCell: (params) => (
				<div className="flex">
					<IconButton
						color="primary"
						onClick={() => window.open(params.row.url, "_blank")}
					>
						<FileDownloadIcon />
					</IconButton>
				</div>
			),
		},
	];
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Backup and Restore
				</h2>
			}
		>
			<Head title="Backup and Restore" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3"></div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense>
								<DataTable
									columns={Columns}
									response={backups}
									filtersAvailable={false}
									sortAvailable={false}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
