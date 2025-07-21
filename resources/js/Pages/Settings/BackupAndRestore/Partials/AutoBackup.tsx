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
import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

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
	} = useForm<FormStruture>({ mode: "onChange" });

	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined); // Para almacenar el timeout

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(route("backup.settings"));
				setValue("active", response.data.active);
				setValue("schedule", response.data.schedule);
				setValue("time", response.data.time);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
		return () => {
			debounceRef.current && clearTimeout(debounceRef.current);
		};
	}, []);

	const onSubmit = useCallback((data: FormStruture) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(async () => {
			try {
				axios.post(route("backup.toggle"), data);
			} catch (error) {
				console.log(error);
			}
		}, 1000);
	}, []);

	useEffect(() => {
		console.log(isValid);
		if (!isValid) {
			setValue("active", false);
		}
	}, [isValid]);

	return (
		<div>
			<Controller
				name="active"
				control={control}
				render={({ field: { onChange, value } }) => (
					<FormControlLabel
						control={
							<Switch
								disabled={isSubmitting}
								checked={watch("active") ?? false}
								value={value}
								onChange={(_e, checked) => {
									onChange(checked);
									handleSubmit(onSubmit)();
								}}
							/>
						}
						label="Backups automaticos"
						labelPlacement="start"
					/>
				)}
			/>
			<div className="flex gap-3">
				<FormControl variant="filled" className="w-full" required>
					<InputLabel id="demo-simple-select-filled-label">
						Frecuencia
					</InputLabel>
					<Select
						labelId="demo-simple-select-filled-label"
						id="demo-simple-select-filled"
						defaultValue={""}
						value={watch("schedule") ?? ""}
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
