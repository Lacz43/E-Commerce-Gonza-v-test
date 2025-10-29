import {
	ShoppingCart,
	ContentCopy,
	PhoneAndroid,
	AccountBalance,
	CreditCard,
} from "@mui/icons-material";
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import { useOrderSettings } from "@/Hook/useOrderSettings";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
	orderDetails: { id: string; amount: number } | null;
	onClose: () => void;
};

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

const getTypeIcon = (type: string) => {
	switch (type) {
		case "pago_movil":
			return <PhoneAndroid />;
		case "transferencia_bancaria":
			return <AccountBalance />;
		case "zelle":
			return <CreditCard />;
		case "binance":
			return <CreditCard />;
		default:
			return <CreditCard />;
	}
};

export default function OrderInfoDialog({ orderDetails, onClose }: Props) {
	const { settings } = useGeneralSettings();
	const { settings: orderSettings } = useOrderSettings();

	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
		null,
	);

	useEffect(() => {
		axios
			.get(route("payment-methods.active"))
			.then((res) => {
				setPaymentMethods(res.data.payment_methods);
			})
			.catch(() => {
				toast.error("Error al cargar métodos de pago");
			});
	}, []);

	const handleCopy = () => {
		if (!selectedMethod) return;

		const details = Object.values(selectedMethod.account_details).join("\n");
		const text = details;

		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success("Información copiada al portapapeles");
			})
			.catch(() => {
				toast.error("Error al copiar");
			});
	};

	if (!orderDetails) return null;

	return (
		<ModalStyled
			onClose={onClose}
			header={
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
						<ShoppingCart className="text-white" fontSize="medium" />
					</div>
					<div>
						<h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-100 to-blue-200 bg-clip-text text-transparent">
							Información de la Orden
						</h2>
						<p className="text-sm text-slate-100 font-medium">
							ID: {orderDetails.id}
						</p>
					</div>
				</div>
			}
			body={
				<div className="space-y-4">
					<div className="text-center">
						<p className="text-lg font-semibold text-slate-700 mb-2">
							ID de Orden
						</p>
						<p className="text-2xl font-bold bg-gradient-to-r text-green-700 bg-clip-text mb-4">
							{orderDetails.id}
						</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-semibold text-slate-700 mb-2">
							Monto Total
						</p>
						<p className="text-3xl font-black bg-gradient-to-r bg-clip-text text-green-700">
							{settings.currency === "VES" ? "Bs " : "$ "}
							{orderDetails.amount.toFixed(2)}
						</p>
					</div>
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<p className="text-sm text-yellow-800 font-medium">
							Tiempo restante para realizar el pago:{" "}
							{orderSettings.max_payment_wait_time_hours} horas
						</p>
					</div>
					<div>
						<FormControl fullWidth>
							<InputLabel>Seleccionar Método de Pago</InputLabel>
							<Select
								value={selectedMethod?.id || ""}
								label="Seleccionar Método de Pago"
								onChange={(e) => {
									const id = Number(e.target.value);
									const method = paymentMethods.find((m) => m.id === id);
									setSelectedMethod(method || null);
								}}
							>
								{paymentMethods.map((method) => (
									<MenuItem key={method.id} value={method.id}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											{getTypeIcon(method.type)}
											{method.name} - {method.type_label}
										</Box>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					{selectedMethod && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex justify-between items-center mb-2">
								<Typography variant="h6">
									Detalles del Método de Pago
								</Typography>
								<IconButton onClick={handleCopy} color="primary">
									<ContentCopy />
								</IconButton>
							</div>
							{Object.entries(selectedMethod.account_details).map(
								([key, value]) => (
									<Box key={key} sx={{ mb: 1 }}>
										<Typography variant="body2" color="text.secondary">
											<strong>{getFieldLabel(key)}:</strong> {String(value)}
										</Typography>
									</Box>
								),
							)}
						</div>
					)}
				</div>
			}
			footer={
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
					>
						Cerrar
					</button>
				</div>
			}
		/>
	);
}
