import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	FilledInput,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	TextField,
} from "@mui/material";
import { useCallback, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";

type FormStructure = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	roles: string[];
};

export type FormHandle = {
	submit: () => void;
};

type Props = {
	ref: React.Ref<FormHandle>;
};

/*
 * Form
 * Componente para crear un formulario de usuario
 */
export default function Form({ ref }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormStructure>();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	const handleSubmitForm = useCallback(async (data: FormStructure) => {
		console.log(data);
	}, []);

	useImperativeHandle(ref, () => ({
		submit: () => handleSubmit(handleSubmitForm)(),
	}));

	return (
		<div className="flex flex-col gap-4">
			<TextField
				id="filled-basic"
				label="Correo"
				type="email"
				variant="filled"
				{...register("email", { required: "Proporsione un correo" })}
				helperText={errors.email?.message}
			/>
			<TextField
				id="filled-basic"
				label="Nombre"
				type="text"
				variant="filled"
				{...register("name", { required: "Proporsione un nombre" })}
				helperText={errors.name?.message}
			/>

			<FormControl variant="filled">
				<InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
				<FilledInput
					id="filled-adornment-password"
					type={showPassword ? "text" : "password"}
					endAdornment={
						<InputAdornment position="end">
							<Tooltip
								title={
									showPassword
										? "Ocultar la contraseña"
										: "Mostrar la contraseña"
								}
                                arrow
							>
								<IconButton
									aria-label={
										showPassword
											? "Ocultar la contraseña"
											: "Mostrar la contraseña"
									}
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									onMouseUp={handleMouseUpPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</Tooltip>
						</InputAdornment>
					}
					{...register("password", { required: "Proporsione una contraseña" })}
				/>
				<FormHelperText>{errors.password?.message}</FormHelperText>
			</FormControl>
		</div>
	);
}
