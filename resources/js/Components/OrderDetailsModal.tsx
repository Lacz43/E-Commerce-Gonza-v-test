import { router } from "@inertiajs/react";
import {
    Box,
    Button,
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

type Order = {
	id: number;
	user: { name: string } | null;
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

	useEffect(() => {
		axios.get(`/orders/${orderId}`).then((response) => {
			setOrder(response.data);
			setLoading(false);
		});
	}, [orderId]);

	const updateStatus = async (status: string) => {
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

	const header = (
		<Typography variant="h5">Detalles del Pedido #{order.id}</Typography>
	);

	const body = (
		<>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
				<Box sx={{ flex: "1 1 45%" }}>
					<Typography>
						<strong>Usuario:</strong> {order.user?.name ?? "Anónimo"}
					</Typography>
				</Box>
				<Box sx={{ flex: "1 1 45%" }}>
					<Typography>
						<strong>Estado:</strong> {order.status}
					</Typography>
				</Box>
				<Box sx={{ flex: "1 1 45%" }}>
					<Typography>
						<strong>Fecha:</strong>{" "}
						{new Date(order.created_at).toLocaleString()}
					</Typography>
				</Box>
				<Box sx={{ flex: "1 1 45%" }}>
					<Typography>
						<strong>Total:</strong> ${total.toFixed(2)}
					</Typography>
				</Box>
			</Box>
			<Divider sx={{ my: 2 }} />
			<Typography variant="h6" gutterBottom>
				Productos
			</Typography>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="productos de la orden">
					<TableHead>
						<TableRow>
							<TableCell>Producto</TableCell>
							<TableCell align="right">Cantidad</TableCell>
							<TableCell align="right">Precio</TableCell>
							<TableCell align="right">Subtotal</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{order.order_items.map((item) => (
							<TableRow
								key={item.id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{item.product.name}
								</TableCell>
								<TableCell align="right">{item.quantity}</TableCell>
								<TableCell align="right">${item.price}</TableCell>
								<TableCell align="right">
									${(item.price * item.quantity).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Divider sx={{ my: 2 }} />
			<Typography variant="h6" gutterBottom>
				Cambiar Estado
			</Typography>
			<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
				{["cancelled", "expired", "completed", "paid"].map(
					(status) => (
						<Button
							key={status}
							variant={order.status === status ? "contained" : "outlined"}
							onClick={() => updateStatus(status)}
							disabled={updating}
						>
							{status}
						</Button>
					),
				)}
			</Box>
		</>
	);

	const footer = <Button onClick={() => closeModal()}>Cerrar</Button>;

	return (
		<ModalStyled
			header={header}
			body={body}
			footer={footer}
			onClose={() => closeModal()}
		/>
	);
}
