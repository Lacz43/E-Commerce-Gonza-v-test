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

export default function GuestOrderItemsCard({ control, errors }: Props) {
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
								const value =
									e.target.value === "" ? null : parseInt(e.target.value);
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
			</CardContent>
		</Card>
	);
}
