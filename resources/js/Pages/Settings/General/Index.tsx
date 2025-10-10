import { Head, router } from "@inertiajs/react";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import axios, { AxiosError, toFormData } from "axios";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

/*
 * INFO: GeneralSettings
 * company_name: nombre de la empresa
 * company_logo: ruta del logo de la empresa
 * company_logo_url: URL completa del logo
 * company_phone: teléfono de la empresa
 * company_address: dirección de la empresa
 * company_rif: RIF de la empresa
 * company_email: email de la empresa
 */
type GeneralSettings = {
	company_name: string;
	company_logo: string | null;
	company_logo_url: string | null;
	company_phone: string;
	company_address: string;
	company_rif: string;
	company_email: string;
};

/*
 * INFO: FormStructure
 * company_name: nombre de la empresa
 * company_logo: archivo del logo
 * company_phone: teléfono de la empresa
 * company_address: dirección de la empresa
 * company_rif: RIF de la empresa
 * company_email: email de la empresa
 */
type FormStructure = {
	company_name: string;
	company_logo: File | null;
	company_phone: string;
	company_address: string;
	company_rif: string;
	company_email: string;
};

// INFO: Props: propiedades que recibe el componente
type Props = {
	settings: GeneralSettings;
};

export default function Index({ settings }: Props) {
	const [logoPreview, setLogoPreview] = useState<string | null>(
		settings.company_logo_url,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormStructure>({
		defaultValues: {
			company_name: settings.company_name,
			company_logo: null,
			company_phone: settings.company_phone,
			company_address: settings.company_address,
			company_rif: settings.company_rif,
			company_email: settings.company_email,
		},
	});

	const companyName = watch("company_name");

	const handleLogoChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				setValue("company_logo", file);
				const reader = new FileReader();
				reader.onload = (e) => {
					setLogoPreview(e.target?.result as string);
				};
				reader.readAsDataURL(file);
			}
		},
		[setValue],
	);

	const handleLogoDelete = useCallback(async () => {
		try {
			await axios.delete(route("settings.general.logo.delete"));
			setLogoPreview(null);
			setValue("company_logo", null);
			toast.success("Logo eliminado correctamente");
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(
					error.response?.data?.message || "Error al eliminar el logo",
				);
			}
		}
	}, [setValue]);

	const onSubmit = useCallback(async (data: FormStructure) => {
		setIsSubmitting(true);
		try {
			const formData = toFormData({
				company_name: data.company_name,
				company_logo: data.company_logo,
				company_phone: data.company_phone,
				company_address: data.company_address,
				company_rif: data.company_rif,
				company_email: data.company_email,
			});

			const response = await axios.post(
				route("settings.general.update"),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			toast.success(response.data.message);

			// Actualizar la vista previa del logo si se subió uno nuevo
			if (response.data.settings.company_logo_url) {
				setLogoPreview(response.data.settings.company_logo_url);
			}
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				toast.error(
					error.response?.data?.message ||
						"Error al actualizar la configuración",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, []);

	return (
		<AuthenticatedLayout>
			<Head title="Configuración General" />

			<Box sx={{ p: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Configuración General
				</Typography>

				<Box
					sx={{
						display: "grid",
						gap: 4,
						gridTemplateColumns: "repeat(12, 1fr)",
					}}
				>
					{/* Columna Izquierda: Información de la Empresa */}
					<Box sx={{ gridColumn: { xs: "span 12", md: "span 8" } }}>
						<Card>
							<CardHeader
								title="Información de la Empresa"
								avatar={<SettingsIcon />}
							/>
							<CardContent>
								<Box
									component="form"
									onSubmit={handleSubmit(onSubmit)}
									sx={{ display: "flex", flexDirection: "column", gap: 3 }}
								>
									<TextField
										label="Nombre de la Empresa"
										fullWidth
										{...register("company_name", {
											required: "El nombre de la empresa es requerido",
										})}
										value={companyName}
										error={!!errors.company_name}
										helperText={errors.company_name?.message}
									/>

									<Box
										sx={{
											display: "grid",
											gap: 2,
											gridTemplateColumns: "repeat(12, 1fr)",
										}}
									>
										<Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
											<Tooltip title="Ejemplo: 0412-1234567" placement="top">
												<TextField
													label="Teléfono"
													fullWidth
													{...register("company_phone", {
														required: "El teléfono es requerido",
														pattern: {
															value: /^0[24][0-9]{2}-?[0-9]{7}$/,
															message: "Formato de teléfono inválido (ej: 0412-1234567)",
														},
													})}
													error={!!errors.company_phone}
													helperText={errors.company_phone?.message}
												/>
											</Tooltip>
										</Box>
										<Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
											<Tooltip
												title="Ejemplo: usuario@ejemplo.com"
												placement="top"
											>
												<TextField
													label="Email"
													type="email"
													fullWidth
													{...register("company_email", {
														required: "El email es requerido",
														pattern: {
															value: /^\S+@\S+\.\S+$/,
															message: "Formato de email inválido",
														},
													})}
													error={!!errors.company_email}
													helperText={errors.company_email?.message}
												/>
											</Tooltip>
										</Box>
									</Box>

									<TextField
										label="Dirección"
										fullWidth
										multiline
										rows={3}
										{...register("company_address", {
											required: "La dirección es requerida",
										})}
										error={!!errors.company_address}
										helperText={errors.company_address?.message}
									/>

									<Box
										sx={{
											display: "grid",
											gap: 2,
											gridTemplateColumns: "repeat(12, 1fr)",
										}}
									>
										<Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
											<Tooltip title="Ejemplo: V-12345678-9" placement="top">
												<TextField
													label="RIF"
													fullWidth
													{...register("company_rif", {
														required: "El RIF es requerido",
														pattern: {
															value: /^[V|E|J|G|P]-[0-9]{8}-[0-9]$/,
															message:
																"Formato de RIF inválido (ej: V-12345678-9)",
														},
													})}
													error={!!errors.company_rif}
													helperText={errors.company_rif?.message}
												/>
											</Tooltip>
										</Box>
									</Box>

									<Box
										sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
									>
										<Button
											type="submit"
											variant="contained"
											disabled={isSubmitting}
											size="large"
										>
											{isSubmitting ? "Guardando..." : "Guardar Cambios"}
										</Button>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Box>

					{/* Columna Derecha: Logo de la Empresa */}
					<Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
						<Card sx={{ height: "fit-content" }}>
							<CardHeader
								title="Logo Corporativo"
								subheader="Identidad visual de tu empresa"
							/>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 3,
									}}
								>
									{/* Vista previa del logo */}
									{logoPreview ? (
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: 2,
												p: 3,
												border: "2px solid",
												borderColor: "primary.main",
												borderRadius: 2,
												backgroundColor: "primary.50",
												width: "100%",
												maxWidth: "250px",
											}}
										>
											<img
												src={logoPreview}
												alt="Logo de la empresa"
												style={{
													maxWidth: "150px",
													maxHeight: "150px",
													objectFit: "contain",
												}}
											/>
											<Button
												variant="outlined"
												color="error"
												size="small"
												startIcon={<DeleteIcon />}
												onClick={handleLogoDelete}
												fullWidth
											>
												Eliminar Logo
											</Button>
										</Box>
									) : (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: "100%",
												maxWidth: "250px",
												height: "200px",
												border: "2px dashed",
												borderColor: "grey.400",
												borderRadius: 2,
												backgroundColor: "grey.50",
											}}
										>
											<Typography
												variant="body2"
												color="text.secondary"
												align="center"
											>
												Sin logo configurado
											</Typography>
										</Box>
									)}

									{/* Input de archivo */}
									<Tooltip
										title="Formatos aceptados: JPG, PNG, GIF, SVG - Tamaño máximo: 2MB"
										placement="top"
									>
										<Button
											variant="outlined"
											component="label"
											fullWidth
											sx={{
												minHeight: "60px",
												border: "2px dashed",
												borderColor: "grey.400",
												"&:hover": {
													borderColor: "primary.main",
													backgroundColor: "primary.50",
												},
											}}
										>
											<Box sx={{ textAlign: "center" }}>
												<Typography variant="body2" color="text.secondary">
													{logoPreview ? "Cambiar Logo" : "Seleccionar Logo"}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
													display="block"
												>
													JPG, PNG, GIF, SVG - Máx. 2MB
												</Typography>
											</Box>
											<input
												ref={fileInputRef}
												type="file"
												hidden
												accept="image/*"
												onChange={handleLogoChange}
											/>
										</Button>
									</Tooltip>

									{errors.company_logo && (
										<Typography
											variant="caption"
											color="error"
											sx={{ textAlign: "center" }}
										>
											{errors.company_logo.message}
										</Typography>
									)}
								</Box>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</Box>
		</AuthenticatedLayout>
	);
}
