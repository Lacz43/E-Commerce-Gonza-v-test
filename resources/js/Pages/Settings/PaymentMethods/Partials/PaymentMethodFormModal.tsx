import { AccountBalance, CreditCard, PhoneAndroid } from "@mui/icons-material";
import {
	Box,
	Button,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";

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
 * INFO: FormData
 */
type FormData = {
	type: "pago_movil" | "transferencia_bancaria" | "zelle" | "binance";
	name: string;
	account_details: Record<string, any>;
	is_active: boolean;
};

/*
 * INFO: PaymentMethodType
 */
type PaymentMethodType = {
	value: "pago_movil" | "transferencia_bancaria" | "zelle" | "binance";
	label: string;
	icon: ReactNode;
	fields: string[];
};

/*
 * Payment method types configuration
 */
const paymentMethodTypes: PaymentMethodType[] = [
	{
		value: "pago_movil",
		label: "Pago Móvil",
		icon: <PhoneAndroid />,
		fields: ["phone", "bank", "account_holder", "document_number"],
	},
	{
		value: "transferencia_bancaria",
		label: "Transferencia Bancaria",
		icon: <AccountBalance />,
		fields: ["bank", "cedula", "account_number", "account_holder"],
	},
	// {
	// 	value: "zelle",
	// 	label: "Zelle",
	// 	icon: <CreditCard />,
	// 	fields: ["email", "account_holder"],
	// },
	// {
	// 	value: "binance",
	// 	label: "Binance",
	// 	icon: <CreditCard />,
	// 	fields: ["wallet_address", "user_id", "email", "merchant_id"],
	// },
];

/*
 * Get field label
 */
const getFieldLabel = (field: string): string => {
	const labels: Record<string, string> = {
		phone: "Teléfono",
		bank: "Banco",
		account_holder: "Titular de la Cuenta",
		document_number: "Número de Documento",
		cedula: "Cédula",
		account_number: "Número de Cuenta",
		email: "Correo Electrónico",
		wallet_address: "Dirección de Billetera",
		user_id: "ID de Usuario",
		merchant_id: "ID de Comercio",
	};
	return labels[field] || field;
};

/*
 * PaymentMethodFormModal component
 */
type PaymentMethodFormModalProps = {
	editingMethod?: PaymentMethod | null;
	onSuccess?: () => void;
	closeModal: () => void;
};

export default function PaymentMethodFormModal({
	editingMethod = null,
	onSuccess,
	closeModal,
}: PaymentMethodFormModalProps) {
	const [selectedType, setSelectedType] =
		useState<PaymentMethodType["value"]>("pago_movil");

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			type: "pago_movil",
			name: "",
			account_details: {},
			is_active: true,
		},
	});

	const watchedType = watch("type");

	// Initialize form when editing
	useEffect(() => {
		if (editingMethod) {
			setSelectedType(editingMethod.type);
			reset({
				type: editingMethod.type,
				name: editingMethod.name,
				account_details: editingMethod.account_details,
				is_active: editingMethod.is_active,
			});
		} else {
			setSelectedType("pago_movil");
			reset({
				type: "pago_movil",
				name: "",
				account_details: {},
				is_active: true,
			});
		}
	}, [editingMethod, reset]);

	/*
	 * Handle type change
	 */
	const handleTypeChange = useCallback((event: SelectChangeEvent) => {
		const type = event.target.value as PaymentMethodType["value"];
		setSelectedType(type);
		reset({
			type,
			name: watch("name"), // Keep the name
			account_details: {}, // Clear account details
			is_active: watch("is_active"), // Keep the active status
		});
	}, []);

	/*
	 * Handle form submit
	 */
	const onSubmit = useCallback(
		async (data: FormData) => {
			try {
				if (editingMethod) {
					await axios.put(
						route("payment-methods.update", editingMethod.id),
						data,
					);
					toast.success("Método de pago actualizado correctamente");
				} else {
					await axios.post(route("payment-methods.store"), data);
					toast.success("Método de pago creado correctamente");
				}

				closeModal();
				onSuccess?.();
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(
						error.response?.data?.message ||
							"Error al guardar el método de pago",
					);
				} else {
					toast.error("Error desconocido");
				}
			}
		},
		[editingMethod, closeModal, onSuccess],
	);
	const currentTypeConfig = useMemo(
		() => paymentMethodTypes.find((t) => t.value === watchedType),
		[watchedType, selectedType],
	);

	return (
		<ModalStyled
			onClose={closeModal}
			header={
				<h2>
					{editingMethod ? "Editar Método de Pago" : "Nuevo Método de Pago"}
				</h2>
			}
			body={
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6 }}>
							<FormControl fullWidth>
								<InputLabel>Tipo de Método</InputLabel>
								<Select
									value={watchedType}
									label="Tipo de Método"
									onChange={handleTypeChange}
								>
									{paymentMethodTypes.map((type) => (
										<MenuItem key={type.value} value={type.value}>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												{type.icon}
												{type.label}
											</Box>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<TextField
								fullWidth
								label="Nombre"
								{...register("name", { required: "El nombre es requerido" })}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					<Typography variant="h6" sx={{ mb: 2 }}>
						Datos de la Cuenta
					</Typography>

					<Grid container spacing={2}>
						{currentTypeConfig?.fields.map((field) => (
							<Grid size={{ xs: 12, md: 6 }} key={field}>
								<TextField
									fullWidth
									label={getFieldLabel(field)}
									{...register(`account_details.${field}`, {
										required: `${getFieldLabel(field)} es requerido`,
										...(field === "phone" && {
											pattern: {
												value: /^\d{4}-\d{7}$/,
												message: "Formato: xxxx-xxxxxxx",
											},
										}),
										...(field === "account_number" && {
											pattern: {
												value: /^\d{20}$/,
												message: "Debe tener exactamente 20 dígitos",
											},
										}),
										...(field === "email" && {
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: "Correo electrónico inválido",
											},
										}),
										...(field === "cedula" && {
											pattern: {
												value: /^\d+$/,
												message: "La cédula debe contener solo números",
											},
										}),
									})}
									error={!!errors.account_details?.[field]}
									helperText={
										errors.account_details?.[field]?.message as string
									}
								/>
							</Grid>
						))}
					</Grid>
				</form>
			}
			footer={
				<div className="flex justify-end gap-3">
					<Button onClick={closeModal} variant="outlined">
						Cancelar
					</Button>
					<Button
						type="submit"
						variant="contained"
						onClick={handleSubmit(onSubmit)}
					>
						{editingMethod ? "Actualizar" : "Crear"}
					</Button>
				</div>
			}
		/>
	);
}
