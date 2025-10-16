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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "@/Components/PageHeader";
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
		control,
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
				<PageHeader
					title="Configuración de Órdenes"
					subtitle="Gestiona los parámetros de tus órdenes"
					icon={SettingsIcon}
					gradientColor="#667eea"
				/>

				<Card
					elevation={2}
					sx={{
						borderRadius: 3,
						border: "1px solid rgba(102, 126, 234, 0.15)",
					}}
				>
					<CardHeader
						title={
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									sx={{
										background:
											"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
										borderRadius: 2,
										p: 1,
										display: "flex",
									}}
								>
									<SettingsIcon sx={{ color: "white", fontSize: 24 }} />
								</Box>
								<Typography variant="h6" fontWeight={600}>
									Tiempo de Espera para Pago
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
							<Controller
								name="max_payment_wait_time_hours"
								control={control}
								render={({ field }) => (
									<TextField
										select
										label="Tiempo Máximo (Horas)"
										fullWidth
										variant="filled"
										value={field.value === null ? "" : field.value}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === "" ? null : Number(value));
										}}
										error={!!errors.max_payment_wait_time_hours}
										helperText={
											errors.max_payment_wait_time_hours?.message ||
											"Selecciona 'Desactivado' para no establecer límite de tiempo"
										}
									>
										<MenuItem value="">
											<em>Desactivado (sin límite)</em>
										</MenuItem>
										{Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
											<MenuItem key={hour} value={hour}>
												{hour} hora{hour !== 1 ? "s" : ""}
											</MenuItem>
										))}
									</TextField>
								)}
							/>

							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
								<Button
									type="submit"
									variant="contained"
									disabled={isSubmitting}
									sx={{
										background:
											"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: 700,
										textTransform: "none",
										fontSize: 16,
										"&:hover": {
											background:
												"linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
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
		</AuthenticatedLayout>
	);
}
