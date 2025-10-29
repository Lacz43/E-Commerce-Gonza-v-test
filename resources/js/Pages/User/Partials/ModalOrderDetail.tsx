import { router } from "@inertiajs/react";
import { AttachMoney, CalendarToday } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useModal } from "@/Context/Modal";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";

type Order = {
	id: number;
	user: User;
	status: string;
	order_items: OrderItem[];
	created_at: string;
};

type OrderItem = {
	id: number;
	product: { name: string };
	quantity: number;
	price: number;
};

type Props = {
	data: Order;
	onClose: () => void;
};

export default function ModalOrderDetail({ data: order, onClose }: Props) {
	const { closeModal } = useModal();
	const { settings } = useGeneralSettings();
	const [updating, setUpdating] = useState(false);
	const [showConfirmCancel, setShowConfirmCancel] = useState(false);

	const total =
		order?.order_items?.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		) ?? 0;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "success";
			case "paid":
				return "info";
			case "cancelled":
				return "error";
			case "pending":
				return "warning";
			default:
				return "default";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "completed":
				return "Completado";
			case "paid":
				return "Pagado";
			case "cancelled":
				return "Cancelado";
			case "pending":
				return "Pendiente";
			default:
				return status;
		}
	};

	const updateStatus = async () => {
		setUpdating(true);
		try {
			await axios.put(route('orders.cancel', order.id));
			toast.success("Pedido cancelado exitosamente");
			router.reload();
			closeModal();
		} catch (error) {
			toast.error("Error al cancelar el pedido");
			console.error(error);
		} finally {
			setUpdating(false);
		}
	};

	const header = (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Box>
				<Typography variant="h5" fontWeight={700}>
					Pedido #{order.id}
				</Typography>
			</Box>
		</Box>
	);

	const body = (
		<>
			{/* Información del Pedido */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
					gap: 3,
					mb: 3,
				}}
			>
				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
						border: "1px solid #d8b4fe",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<CalendarToday sx={{ color: "#9333ea", fontSize: 20 }} />
						<Typography
							variant="caption"
							color="text.secondary"
							fontWeight={600}
						>
							FECHA
						</Typography>
					</Box>
					<Typography variant="body1" fontWeight={600}>
						{new Date(order.created_at).toLocaleString()}
					</Typography>
				</Box>

				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
						border: "1px solid #6ee7b7",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<AttachMoney sx={{ color: "#059669", fontSize: 20 }} />
						<Typography
							variant="caption"
							color="text.secondary"
							fontWeight={600}
						>
							TOTAL
						</Typography>
					</Box>
					<Typography variant="h6" fontWeight={700} color="#059669">
						{settings.currency === "VES" ? "Bs" : "$"} {total.toFixed(2)}
					</Typography>
				</Box>
			</Box>

			{/* Estado Actual */}
			<Box sx={{ mb: 3, textAlign: "center" }}>
				<Typography variant="body2" color="text.secondary" mb={1}>
					Estado Actual
				</Typography>
				<Chip
					label={getStatusLabel(order.status)}
					color={
						getStatusColor(order.status) as
							| "default"
							| "primary"
							| "secondary"
							| "error"
							| "info"
							| "success"
							| "warning"
					}
					sx={{
						fontWeight: 700,
						fontSize: 14,
						px: 2,
						py: 2.5,
					}}
				/>
			</Box>
			<Divider sx={{ my: 3 }} />
			<Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
				📦 Productos
			</Typography>
			<TableContainer
				component={Paper}
				elevation={0}
				sx={{
					borderRadius: 2,
					border: "1px solid",
					borderColor: "divider",
				}}
			>
				<Table sx={{ minWidth: 650 }} aria-label="productos de la orden">
					<TableHead>
						<TableRow
							sx={{
								background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
							}}
						>
							<TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
							<TableCell align="right" sx={{ fontWeight: 700 }}>
								Cantidad
							</TableCell>
							<TableCell align="right" sx={{ fontWeight: 700 }}>
								Precio
							</TableCell>
							<TableCell align="right" sx={{ fontWeight: 700 }}>
								Subtotal
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{order.order_items.map((item, index) => (
							<TableRow
								key={item.id}
								sx={{
									"&:last-child td, &:last-child th": { border: 0 },
									"&:hover": {
										background: "#f9fafb",
									},
									background: index % 2 === 0 ? "white" : "#fafafa",
								}}
							>
								<TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
									{item.product.name}
								</TableCell>
								<TableCell align="right">
									<Chip
										label={item.quantity}
										size="small"
										color="primary"
										variant="outlined"
									/>
								</TableCell>
								<TableCell align="right" sx={{ color: "text.secondary" }}>
									{settings.currency === "VES" ? "Bs" : "$"} {item.price}
								</TableCell>
								<TableCell align="right" sx={{ fontWeight: 700 }}>
									{settings.currency === "VES" ? "Bs" : "$"}{" "}
									{(item.price * item.quantity).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
						<TableRow
							sx={{
								background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
							}}
						>
							<TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: 16 }}>
								TOTAL
							</TableCell>
							<TableCell
								align="right"
								sx={{ fontWeight: 700, fontSize: 18, color: "#059669" }}
							>
								{settings.currency === "VES" ? "Bs" : "$"} {total.toFixed(2)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Divider sx={{ my: 3 }} />
			{order.status !== "completed" &&
				order.status !== "cancelled" &&
				order.status !== "paid" && (
					<Box sx={{ textAlign: "center" }}>
						<Button
							variant="contained"
							color="error"
							onClick={() => setShowConfirmCancel(true)}
							disabled={updating}
							sx={{
								py: 1.5,
								borderRadius: 2,
								fontWeight: 600,
								textTransform: "none",
							}}
						>
							Cancelar Pedido
						</Button>
					</Box>
				)}
		</>
	);

	const footer = (
		<Button
			onClick={() => closeModal()}
			variant="outlined"
			size="large"
			sx={{
				px: 4,
				py: 1.5,
				borderRadius: 2,
				fontWeight: 600,
				textTransform: "none",
			}}
		>
			Cerrar
		</Button>
	);

	return (
		<>
			<ModalStyled
				header={header}
				body={body}
				footer={footer}
				onClose={() => closeModal()}
			/>
			<Dialog
				open={showConfirmCancel}
				onClose={() => setShowConfirmCancel(false)}
			>
				<DialogTitle>Confirmar Cancelación</DialogTitle>
				<DialogContent>
					<Typography>
						¿Estás seguro de que deseas cancelar este pedido?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setShowConfirmCancel(false)}
						variant="outlined"
						sx={{
							py: 1.5,
							borderRadius: 2,
							fontWeight: 600,
							textTransform: "none",
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={() => {
							setShowConfirmCancel(false);
							updateStatus();
						}}
						variant="contained"
						color="error"
						disabled={updating}
						sx={{
							py: 1.5,
							borderRadius: 2,
							fontWeight: 600,
							textTransform: "none",
						}}
					>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
