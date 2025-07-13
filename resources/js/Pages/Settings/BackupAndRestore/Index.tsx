import { Head, router } from "@inertiajs/react";
import BackupIcon from "@mui/icons-material/Backup";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	OutlinedInput,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import axios, { toFormData } from "axios";
import { format } from "date-fns";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));

type BackupAndRestore = {
	name: string;
	size: number;
	lastModified: string;
	url: string;
};

type FormStruture = {
	file: File;
};

type Props = {
	backups: paginateResponse<BackupAndRestore>;
};

export default function BackupAndRestore({ backups }: Props) {
	console.log(backups);
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	const onSubmit = async (data: FormStruture) => {
		try {
			const formData = toFormData(data, new FormData());
			await axios.post(route("backup.restore"), formData);
		} catch (e) {
			console.log(e);
		}
	};

	const Columns = useMemo<GridColDef[]>(
		() => [
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
		],
		[],
	);

	const handleBackup = useCallback(async () => {
		setLoading(true);
		try {
			await axios.post(route("backup.trigger"));
			setLoading(false);
			router.reload();
		} catch (e) {
			console.log(e);
		}
	}, []);

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
					<div className="bg-white shadow-lg sm:rounded-lg grid grid-cols-2 gap-4 mb-3 p-2">
						<div className="text-gray-900">
							<Button
								variant="contained"
								size="medium"
								endIcon={<BackupIcon />}
								onClick={handleBackup}
								loading={loading}
							>
								<b>Respaldar</b>
							</Button>
							<div className="flex mt-3">
								<FormControl>
									<div className="flex">
										<OutlinedInput
											type="file"
											size="small"
											inputProps={{
												accept: ".zip,.sql",
											}}
											{...register("file", {
												required: "Es requirido un archivo",
											})}
										/>
										<Button
											variant="contained"
											size="medium"
											endIcon={<BackupIcon />}
											loading={isSubmitting}
											onClick={handleSubmit(onSubmit)}
										>
											<b>Restaurar</b>
										</Button>
									</div>
									<FormHelperText className="red text-center">
										{errors.file?.message}
									</FormHelperText>
								</FormControl>
							</div>
						</div>
					</div>
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
