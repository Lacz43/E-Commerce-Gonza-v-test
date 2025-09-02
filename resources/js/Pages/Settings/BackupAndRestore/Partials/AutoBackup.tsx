import {
	Chip,
	FormControl,
	FormControlLabel,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
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
		<div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-orange-50 to-emerald-50 p-4 shadow-inner">
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-3">
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
									<span className="font-medium text-emerald-900">
										Backups automáticos
									</span>
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
				</div>
				<CircularProgress
					size={20}
					className="mt-1 ml-2"
					color="inherit"
					hidden={!loading}
				/>
			</div>
			<div
				className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 transition-opacity"
				style={{ opacity: active ? 1 : 0.5 }}
			>
				<FormControl
					variant="outlined"
					className="w-full"
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
					<FormHelperText className="text-red-600">
						{errors?.schedule?.message}
					</FormHelperText>
				</FormControl>
				<TextField
					className="w-full"
					type="time"
					id={timeId}
					label="Hora"
					value={watch("time") ?? ""}
					variant="outlined"
					size="small"
					{...register("time")}
					disabled={!active || isSubmitting}
					// se dispara por efecto debounce
				/>
			</div>
			{!active && (
				<p className="mt-2 text-xs text-emerald-700">
					Activa el interruptor para programar respaldos automáticos.
				</p>
			)}
		</div>
	);
}
