import {
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
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
	}, []);

	//  onSubmit envia los datos de configuracion del backup a la api
	const onSubmit = useCallback((data: FormStruture) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
		setLoading(true);

		debounceRef.current = setTimeout(async () => {
			// setea el timeout y ejecuta la funcion
			try {
				const response = await axios.post(route("backup.toggle"), data);
				setLoading(false);
				toast.success(response.data.message);
			} catch (error) {
				console.log(error);
				toast.error(
					`Error al cambiar la configuracion de respaldo: ${error.response.data.message}`,
				);
			}
		}, 1500);
	}, []);

	//  esto cambia el valor del switch al validar el formulario
	useEffect(() => {
		console.log(isValid);
		if (!isValid) {
			setValue("active", false);
		}
	}, [isValid]);

	return (
		<div>
			<div className="flex">
				<Controller
					name="active"
					control={control}
					render={({ field: { onChange, value } }) => (
						<FormControlLabel
							control={
								<Switch
									disabled={isSubmitting}
									checked={watch("active") ?? false} // valor del switch
									value={value} // valor del switch
									onChange={(_e, checked) => {
										onChange(checked); // cambia el valor del switch
										handleSubmit(onSubmit)(); // envia los datos al backend
									}}
								/>
							}
							label="Backups automaticos"
							labelPlacement="start"
						/>
					)}
				/>
				<CircularProgress
					size={25}
					className="my-auto ml-4"
					color="inherit"
					hidden={!loading}
				/>
			</div>
			<div className="flex gap-3">
				<FormControl variant="filled" className="w-full" required>
					<InputLabel id="demo-simple-select-filled-label">
						Frecuencia
					</InputLabel>
					<Select
						labelId="demo-simple-select-filled-label"
						id="demo-simple-select-filled"
						defaultValue={""} // valor por defecto
						value={watch("schedule") ?? ""} // valor del select cuando se carga el componente
						disabled={isSubmitting}
						{...register("schedule", { required: "Es requerido un valor." })}
						onChange={() => handleSubmit(onSubmit)()}
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						<MenuItem value={"daily"}>Diariamente</MenuItem>
						<MenuItem value={"weekly"}>Semanalmente</MenuItem>
						<MenuItem value={"monthly"}>Mensualmente</MenuItem>
						<MenuItem value={"yearly"}>Anualmente</MenuItem>
					</Select>
					<FormHelperText>{errors?.schedule?.message}</FormHelperText>
				</FormControl>
				<TextField
					className="w-full"
					type="time"
					id="time"
					label="Hora"
					value={watch("time") ?? ""}
					variant="filled"
					{...register("time")}
					onChangeCapture={handleSubmit(onSubmit)}
				/>
			</div>
		</div>
	);
}
