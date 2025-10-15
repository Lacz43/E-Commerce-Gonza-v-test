import { Head, router } from "@inertiajs/react";
import {
	Backup,
	Delete,
	FileDownload,
	Restore,
	Storage,
} from "@mui/icons-material";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	Paper,
	Typography,
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
import PageHeader from "@/Components/PageHeader";

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
	file: File | null;
};

// INFO: Props: propiedades que reciben el componente
type Props = {
	backups: paginateResponse<BackupAndRestore>;
};

export default function BackupAndRestore({ backups }: Props) {
	const { openModal, closeModal } = useModal();
	const [loading, setLoading] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState<string>("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>({ defaultValues: { file: null } });

	const onSubmit = useCallback(
		async (data: FormStruture) => {
			try {
				const formData = toFormData(data, new FormData());
				const response = await axios.post(route("backup.restore"), formData);
				closeModal();
				toast.success(response.data.message);
			} catch (e) {
				console.log(e);
				toast.error(
					`Error al restaurar: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
				);
			}
		},
		[closeModal],
	);

	// Declaramos handleDelete y deleteModal antes del useMemo Columns para evitar uso previo
	const handleDelete = useCallback(
		async (name: string) => {
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
		},
		[closeModal],
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
		[openModal, handleDelete, loading],
	);

	/*
	 * INFO: Columns: columnas que se mostraran en la tabla
	 * se usa useMemo para no renderizar la tabla cada vez que cambia el estado
	 */
	const Columns = useMemo<GridColDef[]>(
		() => [
			{ field: "name", headerName: "Nombre" },
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
							onClick={() => window.open(params.row.url, "_blank")}
						>
							<FileDownload />
						</IconButton>
						<IconButton
							color="error"
							onClick={() => {
								deleteModal(params.row.name);
							}}
						>
							<Delete />
						</IconButton>
					</div>
				),
			},
		],
		[deleteModal],
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
	}, [closeModal]);

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
		[openModal, handleBackup, loading],
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
		[openModal, handleSubmit, onSubmit, isSubmitting],
	);

	return (
		<AuthenticatedLayout>
			<Head title="Backup and Restore" />
			<Box sx={{ p: 3 }}>
				<PageHeader
					title="Respaldo y Restauración"
					subtitle="Gestiona los respaldos de tu base de datos"
					icon={Storage}
					gradientColor="#0ea5e9"
				/>
				<Box sx={{ maxWidth: "1280px", mx: "auto" }}>
					<Paper
						elevation={2}
						sx={{
							borderRadius: 3,
							border: "1px solid rgba(14, 165, 233, 0.15)",
							p: 3,
							mb: 3,
						}}
					>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
								gap: 3,
							}}
						>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								<Box sx={{ display: "flex", gap: 2 }}>
									<Button
										variant="contained"
										endIcon={<Backup />}
										onClick={() => backupModal()}
										sx={{
											background:
												"linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
											fontWeight: 700,
											textTransform: "none",
											"&:hover": {
												background:
													"linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
											},
										}}
									>
										Respaldar
									</Button>
									<Button
										variant="outlined"
										endIcon={<Restore />}
										onClick={() => restoreModal()}
										sx={{
											borderColor: "#0ea5e9",
											color: "#0ea5e9",
											fontWeight: 700,
											textTransform: "none",
											"&:hover": {
												borderColor: "#0284c7",
												backgroundColor: "rgba(14, 165, 233, 0.05)",
											},
										}}
									>
										Restaurar
									</Button>
								</Box>
								<FormControl fullWidth variant="outlined">
									<Box sx={{ display: "flex", gap: 2 }}>
										<Box
											component="label"
											sx={{
												flex: 1,
												display: "flex",
												alignItems: "center",
												cursor: "pointer",
												borderRadius: 2,
												border: "2px solid",
												borderColor: "rgba(14, 165, 233, 0.3)",
												background:
													"linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)",
												px: 2,
												py: 1.5,
												color: "#0284c7",
												fontWeight: 600,
												"&:hover": {
													borderColor: "#0ea5e9",
													background:
														"linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
												},
											}}
										>
											<Typography variant="body2" fontWeight={600}>
												Seleccionar archivo
											</Typography>
											<input
												{...register("file", {
													required: "Es requirido un archivo",
													onChange: (e) => {
														const file = (e.target as HTMLInputElement)
															.files?.[0];
														setSelectedFileName(file?.name || "");
													},
												})}
												accept=".zip,.sql"
												type="file"
												style={{ display: "none" }}
											/>
										</Box>
										<Box
											sx={{
												flex: 1,
												display: "flex",
												alignItems: "center",
												borderRadius: 2,
												border: "2px dashed",
												borderColor: "rgba(14, 165, 233, 0.3)",
												px: 2,
												py: 1.5,
												backgroundColor: "rgba(14, 165, 233, 0.05)",
											}}
										>
											<Typography
												variant="caption"
												color="text.secondary"
												sx={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{selectedFileName || "Ningún archivo seleccionado"}
											</Typography>
										</Box>
									</Box>
									<FormHelperText error sx={{ textAlign: "center" }}>
										{errors.file?.message}
									</FormHelperText>
								</FormControl>
							</Box>
							<Box>
								<AutoBackup />
							</Box>
						</Box>
					</Paper>
					<Paper
						elevation={2}
						sx={{
							borderRadius: 3,
							border: "1px solid rgba(14, 165, 233, 0.15)",
							p: 3,
						}}
					>
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
								sortAvailable={["lastModified", "size"]}
								fill
							/>
						</Suspense>
					</Paper>
				</Box>
			</Box>
		</AuthenticatedLayout>
	);
}
