import { Head } from "@inertiajs/react";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type OrderSettings = {
	max_payment_wait_time_hours: number | null;
};

type Props = {
	settings: OrderSettings;
};

export default function Index({ settings }: Props) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	console.log(settings);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OrderSettings>({
		defaultValues: {
			max_payment_wait_time_hours: settings.max_payment_wait_time_hours,
		},
	});

	const onSubmit = async (data: OrderSettings) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post(route("settings.order.update"), data);
			toast.success(
				response.data.message || "Configuración actualizada correctamente",
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(
					error.response?.data?.message ||
						"Error al actualizar la configuración",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthenticatedLayout>
			<Head title="Configuración de Órdenes" />

			<Box sx={{ p: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Configuración de Órdenes
				</Typography>

				<Box sx={{ maxWidth: 600 }}>
					<Card>
						<CardHeader
							title="Tiempo de Espera para Pago"
							avatar={<SettingsIcon />}
							subheader="Configura el tiempo máximo para que una orden expire si no se paga"
						/>
						<CardContent>
							<Box
								component="form"
								onSubmit={handleSubmit(onSubmit)}
								sx={{ display: "flex", flexDirection: "column", gap: 3 }}
							>
								<TextField
									select
									label="Tiempo Máximo (Horas)"
									defaultValue=""
									fullWidth
									{...register("max_payment_wait_time_hours", {
										required: "Selecciona el tiempo máximo",
									})}
									error={!!errors.max_payment_wait_time_hours}
									helperText={
										errors.max_payment_wait_time_hours?.message ||
										"Selecciona null para desactivar la expiración automática"
									}
								>
									<MenuItem value="">
										<em>Desactivado (null)</em>
									</MenuItem>
									{Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
										<MenuItem key={hour} value={hour}>
											{hour} hora{hour !== 1 ? "s" : ""}
										</MenuItem>
									))}
								</TextField>

								<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
			</Box>
		</AuthenticatedLayout>
	);
}
