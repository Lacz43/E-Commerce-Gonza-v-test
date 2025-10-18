import { Head } from "@inertiajs/react";
import { Delete, Business, Image as ImageIcon } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	MenuItem,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import axios, { AxiosError, toFormData } from "axios";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";

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
	currency: string;
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
	currency: string;
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

	const { reload } = useGeneralSettings();

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
			currency: settings.currency || "VES",
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
				currency: data.currency,
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
			reload();
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
		<AuthenticatedLayout
			pageTitle="Configuración General"
			pageSubtitle="Gestiona la información de tu empresa"
			pageIcon={Business}
			pageGradientColor="#10b981"
		>
			<Head title="Configuración General" />

			<Box sx={{ p: 3 }}>

				<Box
					sx={{
						display: "grid",
						gap: 4,
						gridTemplateColumns: "repeat(12, 1fr)",
					}}
				>
					{/* Columna Izquierda: Información de la Empresa */}
					<Box sx={{ gridColumn: { xs: "span 12", md: "span 8" } }}>
						<Card
							elevation={2}
							sx={{
								borderRadius: 3,
								border: "1px solid rgba(5, 150, 105, 0.15)",
							}}
						>
							<CardHeader
								title={
									<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
										<Box
											sx={{
												background:
													"linear-gradient(135deg, #10b981 0%, #059669 100%)",
												borderRadius: 2,
												p: 1,
												display: "flex",
											}}
										>
											<Business sx={{ color: "white", fontSize: 24 }} />
										</Box>
										<Typography variant="h6" fontWeight={600}>
											Información de la Empresa
										</Typography>
									</Box>
								}
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
										variant="filled"
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
													variant="filled"
													{...register("company_phone", {
														required: "El teléfono es requerido",
														pattern: {
															value: /^0[24][0-9]{2}-?[0-9]{7}$/,
															message:
																"Formato de teléfono inválido (ej: 0412-1234567)",
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
													variant="filled"
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
										variant="filled"
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
													variant="filled"
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
										<Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
											<TextField
												select
												label="Moneda"
												fullWidth
												value={watch("currency")}
												variant="filled"
												{...register("currency", {
													required: "La moneda es requerida",
												})}
												error={!!errors.currency}
												helperText={errors.currency?.message}
											>
												<MenuItem value="USD">Dólares (USD)</MenuItem>
												<MenuItem value="VES">Bolívares (VES)</MenuItem>
											</TextField>
										</Box>
									</Box>

									<Box
										sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
									>
										<Button
											type="submit"
											variant="contained"
											disabled={isSubmitting}
											sx={{
												background:
													"linear-gradient(135deg, #10b981 0%, #059669 100%)",
												px: 4,
												py: 1.5,
												borderRadius: 2,
												fontWeight: 700,
												textTransform: "none",
												fontSize: 16,
												"&:hover": {
													background:
														"linear-gradient(135deg, #059669 0%, #047857 100%)",
												},
											}}
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
						<Card
							elevation={2}
							sx={{
								height: "fit-content",
								borderRadius: 3,
								border: "1px solid rgba(249, 115, 22, 0.15)",
							}}
						>
							<CardHeader
								title={
									<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
										<Box
											sx={{
												background:
													"linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
												borderRadius: 2,
												p: 1,
												display: "flex",
											}}
										>
											<ImageIcon sx={{ color: "white", fontSize: 24 }} />
										</Box>
										<Box>
											<Typography variant="h6" fontWeight={600}>
												Logo Corporativo
											</Typography>
											<Typography variant="caption" color="text.secondary">
												Identidad visual de tu empresa
											</Typography>
										</Box>
									</Box>
								}
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
												startIcon={<Delete />}
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
