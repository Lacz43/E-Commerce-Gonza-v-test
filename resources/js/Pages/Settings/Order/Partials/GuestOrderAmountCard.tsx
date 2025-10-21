import SettingsIcon from "@mui/icons-material/Settings";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Typography,
} from "@mui/material";
import { Control, Controller, FieldErrors } from "react-hook-form";

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

export default function GuestOrderAmountCard({ control, errors }: Props) {
	return (
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
								const value =
									e.target.value === "" ? null : parseFloat(e.target.value);
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
			</CardContent>
		</Card>
	);
}
