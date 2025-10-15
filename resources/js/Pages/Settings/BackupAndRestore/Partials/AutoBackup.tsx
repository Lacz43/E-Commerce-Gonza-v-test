import { Schedule } from "@mui/icons-material";
import {
	Box,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormStruture = {
	schedule: "daily" | "weekly" | "monthly" | "yearly" | "";
	time: string | undefined;
	active: boolean;
};

export default function AutoBackup() {
	const {
		handleSubmit,
		control,
		setValue,
		register,
		watch,
		formState: { isSubmitting, errors, isValid },
	} = useForm<FormStruture>({ mode: "onChange" }); // se usa mode: "onChange" para que el valor del input se actualice cuando se cambie el switch
	const [loading, setLoading] = useState(false);

	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined); // Para almacenar el timeout

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			try {
				//  cargamos los datos de la configuracio desde el backend
				const response = await axios.get(route("backup.settings"));
				setValue("active", response.data.active);
				setValue("schedule", response.data.schedule);
				setValue("time", response.data.time);
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
		return () => {
			// limpiamos el timeout al desmontar el componente
			debounceRef.current && clearTimeout(debounceRef.current);
		};
	}, [setValue]);

	//  onSubmit envia los datos (llamado desde efecto debounce)
	const onSubmit = useCallback((data: FormStruture) => {
		setLoading(true);
		// única capa de debounce manejada por efecto externo
		axios
			.post(route("backup.toggle"), data)
			.then((response) => {
				toast.success(response.data.message);
			})
			.catch((error) => {
				console.log(error);
				toast.error(
					`Error al cambiar la configuracion de respaldo: ${error instanceof AxiosError ? error.response?.data.message : ""}`,
				);
			})
			.finally(() => setLoading(false));
	}, []);

	//  esto cambia el valor del switch al validar el formulario
	useEffect(() => {
		console.log(isValid);
		if (!isValid) {
			setValue("active", false);
		}
	}, [isValid, setValue]);

	const active = watch("active") ?? false;
	const scheduleId = useId();
	const scheduleLabelId = useId();
	const timeId = useId();

	// Efecto debounce para enviar cambios evitando conflicto de focus con el menú
	const scheduleVal = watch("schedule");
	const timeVal = watch("time");
	useEffect(() => {
		if (!active) return;
		const data: FormStruture = {
			schedule: scheduleVal as FormStruture["schedule"],
			time: timeVal,
			active,
		};
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => onSubmit(data), 800);
		return () => {
			debounceRef.current && clearTimeout(debounceRef.current);
		};
	}, [scheduleVal, timeVal, active, onSubmit]);

	return (
		<Box
			sx={{
				borderRadius: 3,
				border: "2px solid",
				borderColor: "rgba(14, 165, 233, 0.2)",
				background:
					"linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)",
				p: 3,
				boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					mb: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Controller
						name="active"
						control={control}
						render={({ field: { onChange, value } }) => (
							<FormControlLabel
								control={
									<Switch
										color={active ? "success" : "default"}
										disabled={isSubmitting}
										checked={active}
										value={value}
										onChange={(_e, checked) => {
											onChange(checked);
											handleSubmit(onSubmit)();
										}}
									/>
								}
								label={
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Schedule sx={{ fontSize: 20, color: "#0284c7" }} />
										<Typography
											variant="body1"
											fontWeight={600}
											color="#0284c7"
										>
											Backups automáticos
										</Typography>
									</Box>
								}
								labelPlacement="end"
							/>
						)}
					/>
					<Chip
						label={active ? "Activo" : "Inactivo"}
						color={active ? "success" : "default"}
						variant={active ? "filled" : "outlined"}
						size="small"
					/>
				</Box>
				{loading && (
					<CircularProgress size={20} sx={{ mt: 0.5, ml: 1 }} color="primary" />
				)}
			</Box>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
					gap: 2,
					opacity: active ? 1 : 0.5,
					transition: "opacity 0.3s ease",
				}}
			>
				<FormControl
					variant="filled"
					fullWidth
					required
					disabled={!active || isSubmitting}
					size="small"
				>
					<InputLabel id={scheduleLabelId}>Frecuencia</InputLabel>
					<Select
						labelId={scheduleLabelId}
						id={scheduleId}
						label="Frecuencia"
						value={watch("schedule") ?? ""}
						{...register("schedule", { required: "Es requerido un valor." })}
						MenuProps={{
							PaperProps: {
								className: "rounded-lg shadow-lg",
							},
						}}
					>
						<MenuItem value="">
							<em>Ninguna</em>
						</MenuItem>
						<MenuItem value={"daily"}>Diariamente</MenuItem>
						<MenuItem value={"weekly"}>Semanalmente</MenuItem>
						<MenuItem value={"monthly"}>Mensualmente</MenuItem>
						<MenuItem value={"yearly"}>Anualmente</MenuItem>
					</Select>
					<FormHelperText error>{errors?.schedule?.message}</FormHelperText>
				</FormControl>
				<TextField
					fullWidth
					type="time"
					id={timeId}
					label="Hora"
					value={watch("time") ?? ""}
					variant="filled"
					size="small"
					{...register("time")}
					disabled={!active || isSubmitting}
				/>
			</Box>
			{!active && (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ mt: 2, display: "block" }}
				>
					Activa el interruptor para programar respaldos automáticos.
				</Typography>
			)}
		</Box>
	);
}
