import {
	AccountBalance,
	CreditCard,
	Delete,
	Edit,
	PhoneAndroid,
	Power,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	IconButton,
	Paper,
	Tooltip,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/Components/PageHeader";
import PaymentMethodFormModal from "./Partials/PaymentMethodFormModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateButton from "@/Components/CreateButton";
import { useModal } from "@/Context/Modal";

/*
 * INFO: PaymentMethod
 */
type PaymentMethod = {
	id: number;
	type: "pago_movil" | "transferencia_bancaria" | "zelle" | "binance";
	type_label: string;
	name: string;
	account_details: Record<string, any>;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

/*
 * PaymentMethods component
 */
const paymentMethodTypes = [
	{
		value: "pago_movil",
		label: "Pago Móvil",
		icon: <PhoneAndroid />,
	},
	{
		value: "transferencia_bancaria",
		label: "Transferencia Bancaria",
		icon: <AccountBalance />,
	},
	{
		value: "zelle",
		label: "Zelle",
		icon: <CreditCard />,
	},
	{
		value: "binance",
		label: "Binance",
		icon: <Power />,
	},
];

const getFieldLabel = (key: string) => {
	switch (key) {
		case "phone":
			return "Teléfono";
		case "bank":
			return "Banco";
		case "account_holder":
			return "Titular de la Cuenta";
		case "document_type":
			return "Tipo de Documento";
		case "document_number":
			return "Número de Documento";
		case "account_type":
			return "Tipo de Cuenta";
		case "account_number":
			return "Número de Cuenta";
		case "email":
			return "Correo Electrónico";
		case "wallet_address":
			return "Dirección de Billetera";
		case "user_id":
			return "ID de Usuario";
		case "merchant_id":
			return "ID de Comercio";
		default:
			return key.charAt(0).toUpperCase() + key.slice(1);
	}
};

export default function PaymentMethods({
	paymentMethods,
}: {
	paymentMethods: Record<string, PaymentMethod[]>;
}) {
	const { openModal } = useModal();
	const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

	/*
	 * Handle create
	 */
	const handleCreate = useCallback(() => {
		setEditingMethod(null);
		openModal(({ closeModal }) => (
			<PaymentMethodFormModal
				editingMethod={null}
				onSuccess={() => {
					closeModal();
					window.location.reload();
				}}
				closeModal={closeModal}
			/>
		));
	}, [openModal]);

	/*
	 * Handle edit
	 */
	const handleEdit = useCallback(
		(method: PaymentMethod) => {
			setEditingMethod(method);
			openModal(({ closeModal }) => (
				<PaymentMethodFormModal
					editingMethod={method}
					onSuccess={() => {
						closeModal();
						window.location.reload();
					}}
					closeModal={closeModal}
				/>
			));
		},
		[openModal],
	);

	/*
	 * Handle delete
	 */
	const handleDelete = useCallback(async (method: PaymentMethod) => {
		if (!confirm(`¿Estás seguro de que quieres eliminar "${method.name}"?`)) {
			return;
		}

		try {
			await axios.delete(route("payment-methods.destroy", method.id));
			toast.success("Método de pago eliminado correctamente");
			window.location.reload();
		} catch (error) {
			toast.error("Error al eliminar el método de pago");
		}
	}, []);

	/*
	 * Handle toggle active status
	 */
	const handleToggleActive = useCallback(async (method: PaymentMethod) => {
		try {
			await axios.post(route("payment-methods.toggle", method.id));
			toast.success(
				`Método de pago ${method.is_active ? "desactivado" : "activado"} correctamente`,
			);
			window.location.reload();
		} catch (error) {
			toast.error("Error al cambiar el estado del método de pago");
		}
	}, []);

	return (
		<AuthenticatedLayout>
			<PageHeader
				title="Métodos de Pago"
				subtitle="Gestiona los métodos de pago disponibles para tus clientes"
				icon={CreditCard}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: 16,
				}}
			>
				<CreateButton onAction={handleCreate} label="Nuevo Método" />
			</div>
			<Box sx={{ mt: 3 }}>
				{paymentMethodTypes.map((typeConfig) => {
					const methods = paymentMethods[typeConfig.value] || [];

					return (
						<Card key={typeConfig.value} sx={{ mb: 3 }}>
							<CardHeader
								title={
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										{typeConfig.icon}
										<Typography variant="h6">{typeConfig.label}</Typography>
										<Typography variant="body2" color="text.secondary">
											({methods.length} método{methods.length !== 1 ? "s" : ""})
										</Typography>
									</Box>
								}
							/>
							<CardContent>
								{methods.length === 0 ? (
									<Alert severity="info">
										No hay métodos de pago configurados para{" "}
										{typeConfig.label.toLowerCase()}.
									</Alert>
								) : (
									<Grid container spacing={2}>
										{methods.map((method) => (
											<Grid item xs={12} md={6} lg={4} key={method.id}>
												<Paper
													sx={{
														p: 2,
														border: 1,
														borderColor: method.is_active
															? "success.light"
															: "grey.300",
														opacity: method.is_active ? 1 : 0.6,
													}}
												>
													<Box
														sx={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "flex-start",
															mb: 1,
														}}
													>
														<Typography variant="h6" sx={{ fontSize: "1rem" }}>
															{method.name}
														</Typography>
														<Box>
															<Tooltip
																title={
																	method.is_active ? "Desactivar" : "Activar"
																}
															>
																<IconButton
																	size="small"
																	onClick={() => handleToggleActive(method)}
																	color={
																		method.is_active ? "success" : "default"
																	}
																>
																	{method.is_active ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>
															</Tooltip>
															<Tooltip title="Editar">
																<IconButton
																	size="small"
																	onClick={() => handleEdit(method)}
																	color="primary"
																>
																	<Edit fontSize="small" />
																</IconButton>
															</Tooltip>
															<Tooltip title="Eliminar">
																<IconButton
																	size="small"
																	onClick={() => handleDelete(method)}
																	color="error"
																>
																	<Delete fontSize="small" />
																</IconButton>
															</Tooltip>
														</Box>
													</Box>

													{Object.entries(method.account_details).map(
														([key, value]) => (
															<Box key={key} sx={{ mb: 0.5 }}>
																<Typography
																	variant="body2"
																	color="text.secondary"
																>
																	<strong>{getFieldLabel(key)}:</strong>{" "}
																	{String(value)}
																</Typography>
															</Box>
														),
													)}
												</Paper>
											</Grid>
										))}
									</Grid>
								)}
							</CardContent>
						</Card>
					);
				})}
			</Box>
		</AuthenticatedLayout>
	);
}
