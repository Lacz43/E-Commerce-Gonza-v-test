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
import { Control, Controller, type FieldErrors } from "react-hook-form";

type OrderSettings = {
	max_payment_wait_time_hours: number | null;
	max_guest_orders_per_hour: number;
	max_guest_order_amount: number | null;
	max_guest_order_items: number | null;
};

type Props = {
	control: Control<OrderSettings>;
	errors: FieldErrors<OrderSettings>;
	isSubmitting: boolean;
};

export default function PaymentTimeCard({
	control,
	errors,
}: Props) {
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
								background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
				</Box>
			</CardContent>
		</Card>
	);
}
