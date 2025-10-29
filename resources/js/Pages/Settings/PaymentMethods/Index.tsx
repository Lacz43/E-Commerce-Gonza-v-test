import { Head } from "@inertiajs/react";
import {
	AccountBalance,
	Add,
	CreditCard,
	Delete,
	Edit,
	PhoneAndroid,
	Power,
	PowerOff,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateButton from "@/Components/CreateButton";

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
 * INFO: PaymentMethodsProps
 */
type PaymentMethodsProps = {
	paymentMethods: Record<string, PaymentMethod[]>;
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
	icon: React.ReactNode;
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
		fields: [
			"phone",
			"bank",
			"account_holder",
			"document_type",
			"document_number",
		],
	},
	{
		value: "transferencia_bancaria",
		label: "Transferencia Bancaria",
		icon: <AccountBalance />,
		fields: ["bank", "account_type", "account_number", "account_holder"],
	},
	{
		value: "zelle",
		label: "Zelle",
		icon: <CreditCard />,
		fields: ["email", "account_holder"],
	},
	{
		value: "binance",
		label: "Binance",
		icon: <CreditCard />,
		fields: ["wallet_address", "user_id", "email", "merchant_id"],
	},
];

/*
 * Get field label
 */
const getFieldLabel = (field: string): string => {
	const labels: Record<string, string> = {
		phone: "Teléfono",
		bank: "Banco",
		account_holder: "Titular de la Cuenta",
		document_type: "Tipo de Documento",
		document_number: "Número de Documento",
		account_type: "Tipo de Cuenta",
		account_number: "Número de Cuenta",
		email: "Correo Electrónico",
		wallet_address: "Dirección de Billetera",
		user_id: "ID de Usuario",
		merchant_id: "ID de Comercio",
	};
	return labels[field] || field;
};

/*
 * PaymentMethods component
 */
export default function PaymentMethods({
	paymentMethods,
}: PaymentMethodsProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
		null,
	);
	const [selectedType, setSelectedType] =
		useState<PaymentMethodType["value"]>("pago_movil");

	const {
		register,
		handleSubmit,
		reset,
		setValue,
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

	/*
	 * Handle type change
	 */
	const handleTypeChange = useCallback(
		(event: SelectChangeEvent) => {
			const type = event.target.value as PaymentMethodType["value"];
			setSelectedType(type);
			setValue("type", type);
			setValue("account_details", {});
		},
		[setValue],
	);

	/*
	 * Open create dialog
	 */
	const handleCreate = useCallback(() => {
		setEditingMethod(null);
		setSelectedType("pago_movil");
		reset({
			type: "pago_movil",
			name: "",
			account_details: {},
			is_active: true,
		});
		setDialogOpen(true);
	}, [reset]);

	/*
	 * Open edit dialog
	 */
	const handleEdit = useCallback(
		(method: PaymentMethod) => {
			setEditingMethod(method);
			setSelectedType(method.type);
			reset({
				type: method.type,
				name: method.name,
				account_details: method.account_details,
				is_active: method.is_active,
			});
			setDialogOpen(true);
		},
		[reset],
	);

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

				window.location.reload();
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
		[editingMethod],
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

	/*
	 * Get current type configuration
	 */
	const currentTypeConfig = paymentMethodTypes.find(
		(t) => t.value === watchedType,
	);

	return (
		<AuthenticatedLayout>
			<Head title="Métodos de Pago" />

			<PageHeader
				title="Métodos de Pago"
				subtitle="Gestiona los métodos de pago disponibles para tus clientes"
				icon={CreditCard}
			/>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <CreateButton
                    onAction={handleCreate}
                    label="Nuevo Método"
                />
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

			{/* Create/Edit Dialog */}
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogTitle>
						{editingMethod ? "Editar Método de Pago" : "Nuevo Método de Pago"}
					</DialogTitle>
					<DialogContent>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid item xs={12} md={6}>
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
							<Grid item xs={12} md={6}>
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
								<Grid item xs={12} md={6} key={field}>
									<TextField
										fullWidth
										label={getFieldLabel(field)}
										{...register(`account_details.${field}`, {
											required: `${getFieldLabel(field)} es requerido`,
										})}
										error={!!errors.account_details?.[field]}
										helperText={errors.account_details?.[field]?.message}
									/>
								</Grid>
							))}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
						<Button type="submit" variant="contained">
							{editingMethod ? "Actualizar" : "Crear"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</AuthenticatedLayout>
	);
}
