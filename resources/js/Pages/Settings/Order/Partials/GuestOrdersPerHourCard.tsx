import SettingsIcon from "@mui/icons-material/Settings";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Typography,
} from "@mui/material";
import { type Control, Controller, type FieldErrors } from "react-hook-form";

type OrderSettings = {
	max_payment_wait_time_hours: number | null;
	max_guest_orders_per_hour: number;
	max_guest_order_amount: number | null;
	max_guest_order_items: number | null;
};

type Props = {
	control: Control<OrderSettings>;
	errors: FieldErrors<OrderSettings>;
};

export default function GuestOrdersPerHourCard({ control, errors }: Props) {
	return (
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
								background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
								borderRadius: 2,
								p: 1,
								display: "flex",
							}}
						>
							<SettingsIcon sx={{ color: "white", fontSize: 24 }} />
						</Box>
						<Typography variant="h6" fontWeight={600}>
							Límite de Órdenes (Usuarios No Registrados)
						</Typography>
					</Box>
				}
			/>
			<CardContent>
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
								const value = parseInt(e.target.value, 10);
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
			</CardContent>
		</Card>
	);
}
