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
	max_guest_orders_per_hour: number;
	max_guest_order_amount: number | null;
	max_guest_order_items: number | null;
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
			max_guest_orders_per_hour: settings.max_guest_orders_per_hour,
			max_guest_order_amount: settings.max_guest_order_amount,
			max_guest_order_items: settings.max_guest_order_items,
		},
		mode: "onChange",
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

				<Card
					elevation={2}
					sx={{
						borderRadius: 3,
						border: "1px solid rgba(102, 126, 234, 0.15)",
						mt: 3,
					}}
				>
					<CardHeader
						title={
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									sx={{
										background:
											"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
										borderRadius: 2,
										p: 1,
										display: "flex",
									}}
								>
									<SettingsIcon sx={{ color: "white", fontSize: 24 }} />
								</Box>
								<Typography variant="h6" fontWeight={600}>
									Límite de Órdenes para Usuarios No Registrados
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
								name="max_guest_orders_per_hour"
								control={control}
								rules={{
									required: "Este campo es obligatorio",
									min: {
										value: 1,
										message: "El valor mínimo es 1",
									},
									max: {
										value: 100,
										message: "El valor máximo es 100",
									},
									pattern: {
										value: /^[0-9]+$/,
										message: "Solo se permiten números enteros",
									},
								}}
								render={({ field }) => (
									<TextField
										type="number"
										label="Máximo de Órdenes por Hora"
										fullWidth
										variant="filled"
										value={field.value}
										onChange={(e) => {
											const value = parseInt(e.target.value);
											field.onChange(Number.isNaN(value) ? "" : value);
										}}
										inputProps={{
											min: 1,
											max: 100,
											step: 1,
										}}
										error={!!errors.max_guest_orders_per_hour}
										helperText={
											errors.max_guest_orders_per_hour?.message ||
											"Número máximo de órdenes que pueden hacer usuarios no registrados por hora desde la misma IP"
										}
									/>
								)}
							/>

							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
								<Button
									type="submit"
									variant="contained"
									disabled={isSubmitting}
									sx={{
										background:
											"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: 700,
										textTransform: "none",
										fontSize: 16,
										"&:hover": {
											background:
												"linear-gradient(135deg, #e86fc4 0%, #e74c5b 100%)",
										},
									}}
								>
									{isSubmitting ? "Guardando..." : "Guardar Cambios"}
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>

				<Card
					elevation={2}
					sx={{
						borderRadius: 3,
						border: "1px solid rgba(102, 126, 234, 0.15)",
						mt: 3,
					}}
				>
					<CardHeader
						title={
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									sx={{
										background:
											"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
										borderRadius: 2,
										p: 1,
										display: "flex",
									}}
								>
									<SettingsIcon sx={{ color: "white", fontSize: 24 }} />
								</Box>
								<Typography variant="h6" fontWeight={600}>
									Límite de Monto por Orden (Usuarios No Registrados)
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
								name="max_guest_order_amount"
								control={control}
								rules={{
									min: {
										value: 0,
										message: "El valor mínimo es 0",
									},
									max: {
										value: 10000,
										message: "El valor máximo es 10000",
									},
								}}
								render={({ field }) => (
									<TextField
										type="number"
										label="Monto Máximo por Orden ($)"
										fullWidth
										variant="filled"
										value={field.value === null ? "" : field.value}
										onChange={(e) => {
											const value = e.target.value === "" ? null : parseFloat(e.target.value);
											field.onChange(Number.isNaN(value) ? null : value);
										}}
										inputProps={{
											min: 0,
											max: 10000,
											step: 0.01,
										}}
										error={!!errors.max_guest_order_amount}
										helperText={
											errors.max_guest_order_amount?.message ||
											"Monto máximo total que pueden gastar usuarios no registrados en una sola orden. Dejar vacío para sin límite."
										}
									/>
								)}
							/>

							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
								<Button
									type="submit"
									variant="contained"
									disabled={isSubmitting}
									sx={{
										background:
											"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: 700,
										textTransform: "none",
										fontSize: 16,
										"&:hover": {
											background:
												"linear-gradient(135deg, #3a9be8 0%, #00d4e8 100%)",
										},
									}}
								>
									{isSubmitting ? "Guardando..." : "Guardar Cambios"}
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>

				<Card
					elevation={2}
					sx={{
						borderRadius: 3,
						border: "1px solid rgba(102, 126, 234, 0.15)",
						mt: 3,
					}}
				>
					<CardHeader
						title={
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									sx={{
										background:
											"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
										borderRadius: 2,
										p: 1,
										display: "flex",
									}}
								>
									<SettingsIcon sx={{ color: "white", fontSize: 24 }} />
								</Box>
								<Typography variant="h6" fontWeight={600}>
									Límite de Productos por Orden (Usuarios No Registrados)
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
								name="max_guest_order_items"
								control={control}
								rules={{
									min: {
										value: 1,
										message: "El valor mínimo es 1",
									},
									max: {
										value: 50,
										message: "El valor máximo es 50",
									},
									pattern: {
										value: /^[0-9]+$/,
										message: "Solo se permiten números enteros",
									},
								}}
								render={({ field }) => (
									<TextField
										type="number"
										label="Máximo de Productos por Orden"
										fullWidth
										variant="filled"
										value={field.value === null ? "" : field.value}
										onChange={(e) => {
											const value = e.target.value === "" ? null : parseInt(e.target.value);
											field.onChange(Number.isNaN(value) ? null : value);
										}}
										inputProps={{
											min: 1,
											max: 50,
											step: 1,
										}}
										error={!!errors.max_guest_order_items}
										helperText={
											errors.max_guest_order_items?.message ||
											"Cantidad máxima total de productos (sumando cantidades) que pueden pedir usuarios no registrados en una sola orden. Dejar vacío para sin límite."
										}
									/>
								)}
							/>

							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
								<Button
									type="submit"
									variant="contained"
									disabled={isSubmitting}
									sx={{
										background:
											"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: 700,
										textTransform: "none",
										fontSize: 16,
										"&:hover": {
											background:
												"linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
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
