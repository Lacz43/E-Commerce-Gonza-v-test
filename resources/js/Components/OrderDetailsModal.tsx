import { router } from "@inertiajs/react";
import {
	AttachMoney,
	CalendarToday,
	Email,
	Person,
	ShoppingCart,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useModal } from "@/Context/Modal";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import PermissionService from "@/Services/PermissionService";

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
	orderId: number;
};

export default function OrderDetailsModal({ orderId }: Props) {
	const { closeModal } = useModal();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const { settings } = useGeneralSettings();

	useEffect(() => {
		axios.get(`/orders/${orderId}`).then((response) => {
			setOrder(response.data);
			setLoading(false);
		});
	}, [orderId]);

	const updateStatus = async (status: string) => {
		if (
			order?.status === "completed" &&
			PermissionService.getInstance().hasRole(["seller"])
		) {
			toast.error("No puedes cambiar el estado de una orden completada");
			return;
		}

		setUpdating(true);
		try {
			await axios.put(`/orders/${orderId}`, { status });
			if (order) {
				setOrder({ ...order, status });
			}
			toast.success(`Estado actualizado a ${status}`);
			closeModal();
			router.reload();
		} catch (error) {
			toast.error("Error al actualizar el estado");
			console.error(error);
		} finally {
			setUpdating(false);
		}
	};

	const total =
		order?.order_items?.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		) ?? 0;

	if (loading) {
		return (
			<ModalStyled
				header={<Typography variant="h5">Cargando...</Typography>}
				body={<Typography>Cargando detalles del pedido...</Typography>}
				footer={<Button onClick={() => closeModal()}>Cerrar</Button>}
				onClose={() => closeModal()}
			/>
		);
	}

	if (!order) {
		return (
			<ModalStyled
				header={<Typography variant="h5">Error</Typography>}
				body={<Typography>Error al cargar la orden</Typography>}
				footer={<Button onClick={() => closeModal()}>Cerrar</Button>}
				onClose={() => closeModal()}
			/>
		);
	}

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
						background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
						border: "1px solid #bae6fd",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<Person sx={{ color: "#0284c7", fontSize: 20 }} />
						<Typography
							variant="caption"
							color="text.secondary"
							fontWeight={600}
						>
							USUARIO
						</Typography>
					</Box>
					<Typography variant="body1" fontWeight={600}>
						{order.user?.name ?? "Anónimo"}
					</Typography>
				</Box>

				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
						border: "1px solid #fcd34d",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<Email sx={{ color: "#d97706", fontSize: 20 }} />
						<Typography
							variant="caption"
							color="text.secondary"
							fontWeight={600}
						>
							EMAIL
						</Typography>
					</Box>
					<Typography variant="body1" fontWeight={600}>
						{order.user?.email ?? "Anónimo"}
					</Typography>
				</Box>

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
			<Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
				🔄 Cambiar Estado
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
					gap: 2,
				}}
			>
				<Button
					variant={order.status === "paid" ? "contained" : "outlined"}
					color="info"
					onClick={() => updateStatus("paid")}
					disabled={updating || order.status === "paid"}
					sx={{
						py: 1.5,
						borderRadius: 2,
						fontWeight: 600,
						textTransform: "none",
					}}
				>
					Pagado
				</Button>
				<Button
					variant={order.status === "completed" ? "contained" : "outlined"}
					color="success"
					onClick={() => updateStatus("completed")}
					disabled={updating || order.status === "completed"}
					sx={{
						py: 1.5,
						borderRadius: 2,
						fontWeight: 600,
						textTransform: "none",
					}}
				>
					Completado
				</Button>
				<Button
					variant={order.status === "cancelled" ? "contained" : "outlined"}
					color="error"
					onClick={() => updateStatus("cancelled")}
					disabled={updating || order.status === "cancelled"}
					sx={{
						py: 1.5,
						borderRadius: 2,
						fontWeight: 600,
						textTransform: "none",
					}}
				>
					Cancelado
				</Button>
			</Box>
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
		<ModalStyled
			header={header}
			body={body}
			footer={footer}
			onClose={() => closeModal()}
		/>
	);
}
