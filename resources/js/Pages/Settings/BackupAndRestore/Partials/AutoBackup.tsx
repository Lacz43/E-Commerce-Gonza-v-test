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
import { useEffect } from "react";
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
		getValues,
		setValue,
		register,
		formState: { isSubmitting, errors, isValid },
	} = useForm<FormStruture>({ mode: "onChange" });

	const onSubmit = async (data: FormStruture) => {
		try {
		    axios.post(route("backup.toggle"), data);
		} catch (error) {
			console.log(error);
		}
	};

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
								checked={isValid ? value : false}
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
			<FormControl variant="filled" className="w-full" required>
				<InputLabel id="demo-simple-select-filled-label">Frecuencia</InputLabel>
				<Select
					labelId="demo-simple-select-filled-label"
					id="demo-simple-select-filled"
					defaultValue={""}
					disabled={isSubmitting}
					{...register("schedule", { required: "Es requerido una frecuencia" })}
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
				variant="filled"
				{...register("time")}
				defaultValue={getValues().time}
			/>
		</div>
	);
}
