import { Head, router } from "@inertiajs/react";
import BackupIcon from "@mui/icons-material/Backup";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	OutlinedInput,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import axios, { AxiosError, toFormData } from "axios";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DataTableSkeleton from "@/Components/DataTableSkeleton";
import { useModal } from "@/Context/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AutoBackup from "./Partials/AutoBackup";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalStyled = lazy(() => import("@/Components/Modals/ModalStyled"));

/*
 TODO:
    Vista principal de generar respaldos y restaurar la base de datos
*/

/*
 * INFO: BackupAndRestore
 * name: nombre del archivo
 * size: tamaño del archivo
 * lastModified: fecha de modificacion del archivo
 * url: url del archivo
 */

type BackupAndRestore = {
	name: string;
	size: number;
	lastModified: string;
	url: string;
};

/*
 * INFO: FormStruture
 * file: archivo que se quiere enviar al backend
 */
type FormStruture = {
	file: File;
};

// INFO: Props: propiedades que reciben el componente
type Props = {
	backups: paginateResponse<BackupAndRestore>;
};

export default function BackupAndRestore({ backups }: Props) {
	const { openModal, closeModal } = useModal();
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	const onSubmit = async (data: FormStruture) => {
		try {
			const formData = toFormData(data, new FormData()); // convertimos el formulario a un objeto FormData para poder enviar el archivo
			const response = await axios.post(route("backup.restore"), formData);
			closeModal();
			toast.success(response.data.message);
		} catch (e) {
			console.log(e);
			toast.error(
				`Error al restaurar: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
			);
		}
	};

	/*
	 * INFO: Columns: columnas que se mostraran en la tabla
	 * se usa useMemo para no renderizar la tabla cada vez que cambia el estado
	 */
	const Columns = useMemo<GridColDef[]>(
		() => [
			{ field: "name", headerName: "Nombre"},
			{
				field: "size",
				headerName: "Tamaño",
				type: "number",
				width: 100,
				valueGetter: (value) => `${(Number(value) / 1024).toFixed(2)} KB`, // convertimos el tamaño en KB
			},
			{
				field: "lastModified",
				headerName: "Modificado",
				type: "dateTime",
				valueGetter: (value) => new Date(value * 1000), // convertimos el timestamp en fecha
			},
			{
				field: "url",
				headerName: "Acciones",
				type: "actions",
				renderCell: (
					params, // renderizamos el boton de descarga y borrado
				) => (
					<div className="flex">
						<IconButton
							color="primary"
							onClick={() => window.open(params.row.url, "_blank")} // abrimos el archivo en una nueva pestaña para descargar
						>
							<FileDownloadIcon />
						</IconButton>
						<IconButton
							color="error"
							onClick={() => {
								deleteModal(params.row.name);
							}}
						>
							<DeleteIcon />
						</IconButton>
					</div>
				),
			},
		],
		[],
	);

	/* INFO: handleBackup: funcion que se ejecuta cuando se hace click en el boton de respaldo
	 * se utiliza useCallback para no volver a ejecutar la funcion cuando cambie el estado
	 */
	const handleBackup = useCallback(async () => {
		setLoading(true);
		try {
			const { data } = await axios.post(route("backup.trigger"));
			setLoading(false);
			closeModal();
			router.reload();
			toast.success(data.message);
		} catch (e) {
			console.log(e);
			toast.error(
				`Error al ejecutar el backup: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
			);
		}
	}, []);

	/* INFO: handleDelete: funcion que se ejecuta cuando se hace click en el boton de borrado */
	const handleDelete = useCallback(async (name: string) => {
		if (!name) return;
		setLoading(true);
		try {
			const { data } = await axios.delete(
				route("backup.delete", { file: name }),
			);
			setLoading(false);
			closeModal();
			router.reload();
			toast.success(data.message);
		} catch (e) {
			console.log(e);
			toast.error(
				`Error al eliminar respaldo: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
			);
		}
	}, []);

	const backupModal = useCallback(
		() =>
			openModal(({ closeModal }) => (
				<ModalStyled
					header={<b>Respaldo</b>}
					body={
						<div className="text-center overflow-hidden">
							<p>¿Desea realizar el respaldo?</p>
						</div>
					}
					footer={
						<div className="flex gap-2">
							<Button onClick={() => closeModal()} variant="contained">
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
					onClose={closeModal}
				/>
			)),
		[],
	);

	const restoreModal = useCallback(
		() =>
			openModal(({ closeModal }) => (
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
							<Button onClick={() => closeModal()} variant="contained">
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
					onClose={closeModal}
				/>
			)),
		[],
	);

	const deleteModal = useCallback(
		(name: string) =>
			openModal(({ closeModal }) => (
				<ModalStyled
					header={<b>Borrar</b>}
					body={
						<div className="text-center overflow-hidden">
							<p>
								¿Desea <b>borrar</b> este respaldo?
							</p>
						</div>
					}
					footer={
						<div className="flex gap-2">
							<Button onClick={() => closeModal()} variant="contained">
								<b>Cancelar</b>
							</Button>
							<Button
								onClick={() => handleDelete(name)}
								variant="contained"
								color="error"
								loading={loading}
							>
								<b>Borrar</b>
							</Button>
						</div>
					}
					onClose={() => closeModal()}
				/>
			)),
		[],
	);

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
					<div className="bg-white shadow-lg sm:rounded-lg grid grid-cols-2 gap-4 mb-3 p-2 max-md:grid-cols-1">
						<div className="text-gray-900">
							<Button
								variant="contained"
								size="medium"
								endIcon={<BackupIcon />}
								onClick={() => backupModal()}
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
												accept: ".zip,.sql", // tipos de archivos que se pueden enviar
											}}
											{...register("file", {
												required: "Es requirido un archivo",
											})}
										/>
										<Button
											variant="contained"
											size="medium"
											endIcon={<BackupIcon />}
											onClick={() => restoreModal()}
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
						<div className="text-gray-900">
							<AutoBackup />
						</div>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<Suspense
								fallback={
									<DataTableSkeleton
										columns={Columns.length}
										rows={10}
										showToolbar={false}
									/>
								}
							>
								<DataTable
									columns={Columns}
									response={backups}
									filtersAvailable={false}
									sortAvailable={false}
									fill
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
