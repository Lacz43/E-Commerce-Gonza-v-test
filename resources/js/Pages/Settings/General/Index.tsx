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
 */
type GeneralSettings = {
	company_name: string;
	company_logo: string | null;
	company_logo_url: string | null;
};

/*
 * INFO: FormStructure
 * company_name: nombre de la empresa
 * company_logo: archivo del logo
 */
type FormStructure = {
	company_name: string;
	company_logo: File | null;
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
								{...register("company_name")}
								value={companyName}
								error={!!errors.company_name}
								helperText={errors.company_name?.message}
							/>

							<Box>
								<Typography variant="h6" gutterBottom>
									Logo de la Empresa
								</Typography>

								{/* Vista previa del logo */}
								{logoPreview && (
									<Box
										sx={{
											mb: 2,
											display: "flex",
											alignItems: "center",
											gap: 2,
										}}
									>
										<img
											src={logoPreview}
											alt="Logo de la empresa"
											style={{
												maxWidth: "200px",
												maxHeight: "100px",
												objectFit: "contain",
											}}
										/>
										<Button
											variant="outlined"
											color="error"
											startIcon={<DeleteIcon />}
											onClick={handleLogoDelete}
											size="small"
										>
											Eliminar Logo
										</Button>
									</Box>
								)}

								{/* Input de archivo */}
								<Button
									variant="outlined"
									component="label"
									fullWidth
									sx={{ mb: 1 }}
								>
									Seleccionar Logo
									<input
										ref={fileInputRef}
										type="file"
										hidden
										accept="image/*"
										onChange={handleLogoChange}
									/>
								</Button>

								<Typography variant="caption" color="text.secondary">
									Formatos permitidos: JPG, PNG, GIF, SVG. Tamaño máximo: 2MB
								</Typography>

								{errors.company_logo && (
									<Typography
										variant="caption"
										color="error"
										sx={{ display: "block", mt: 1 }}
									>
										{errors.company_logo.message}
									</Typography>
								)}
							</Box>

							<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
								<Button
									type="submit"
									variant="contained"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Guardando..." : "Guardar Cambios"}
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</AuthenticatedLayout>
	);
}
