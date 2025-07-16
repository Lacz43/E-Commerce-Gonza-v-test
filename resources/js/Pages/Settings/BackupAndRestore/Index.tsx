import { Head, router } from "@inertiajs/react";
import BackupIcon from "@mui/icons-material/Backup";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
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
const ModalStyled = lazy(() => import("@/Components/Modals/ModalStyled"));

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

type modal = "backup" | "restore" | "delete" | null;

export default function BackupAndRestore({ backups }: Props) {
	console.log(backups);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState<modal>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	const onSubmit = async (data: FormStruture) => {
		try {
			const formData = toFormData(data, new FormData());
			await axios.post(route("backup.restore"), formData);
			setOpen(null);
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
						<IconButton color="error" onClick={() => setOpen("delete")}>
							<DeleteIcon />
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
			setOpen(null);
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
								onClick={() => setOpen("backup")}
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
											onClick={() => setOpen("restore")}
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
			<Suspense>
				<ModalStyled
					header={<b>Respaldo</b>}
					body={
						<div className="text-center overflow-hidden">
							<p>¿Desea realizar el respaldo?</p>
						</div>
					}
					footer={
						<div className="flex gap-2">
							<Button onClick={() => setOpen(null)} variant="contained">
								<b>Cancelar</b>
							</Button>
							<Button
								onClick={handleBackup}
								variant="contained"
								color="error"
								loading={loading}
							>
								<b>Respaldar</b>
							</Button>
						</div>
					}
					show={open === "backup"}
					onClose={() => setOpen(null)}
					maxWidth="sm"
				/>
				<ModalStyled
					header={<b>Restaurar</b>}
					body={
						<div className="text-center overflow-hidden">
							<p>
								¿Desea restaurar <b>toda la base de datos</b>?
							</p>
							Tenga en cuenta que el proceso de restauración puede tardar varios
							minutos dependiendo del tamaño de la base de datos.
						</div>
					}
					footer={
						<div className="flex gap-2">
							<Button onClick={() => setOpen(null)} variant="contained">
								<b>Cancelar</b>
							</Button>
							<Button
								onClick={handleSubmit(onSubmit)}
								variant="contained"
								color="error"
								loading={isSubmitting}
							>
								<b>Restaurar</b>
							</Button>
						</div>
					}
					show={open === "restore"}
					onClose={() => setOpen(null)}
					maxWidth="sm"
				/>
				<ModalStyled
					header={<b>Borrar</b>}
					body={
						<div className="text-center overflow-hidden">
							<p>¿Desea <b>borrar</b> este respaldo?</p>
						</div>
					}
					footer={
						<div className="flex gap-2">
							<Button onClick={() => setOpen(null)} variant="contained">
								<b>Cancelar</b>
							</Button>
							<Button
								onClick={handleBackup}
								variant="contained"
								color="error"
								loading={loading}
							>
								<b>Borrar</b>
							</Button>
						</div>
					}
					show={open === "delete"}
					onClose={() => setOpen(null)}
					maxWidth="sm"
				/>
			</Suspense>
		</AuthenticatedLayout>
	);
}
