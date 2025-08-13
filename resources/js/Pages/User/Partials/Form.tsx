import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	FilledInput,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Tooltip,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormStructure = {
	name: string;
	email: string;
	password?: string;
	password_confirmation: string;
	role: number | undefined;
};

export type FormHandle = {
	submit: () => void;
};

type Props = {
	ref: React.Ref<FormHandle>;
	user?: User;
};

/*
 * Form
 * Componente para crear un formulario de usuario
 */
export default function Form({ ref, user }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormStructure>({
		defaultValues: {
			...user,
			role: user?.roles[0].id,
		},
	});
	const [showPassword, setShowPassword] = useState(false);
	const [roles, setRoles] = useState<Roles[]>([]);
	const [loading, setLoading] = useState(false);

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

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const { data } = await axios.get(route("roles"));
				setRoles(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
				toast.error(
					`Error al cargar los roles: ${e instanceof AxiosError ? e.response?.data.message : ""}`,
				);
			}
		})();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<TextField
				id="user-email"
				label="Correo"
				type="email"
				variant="filled"
				{...register("email", { required: "Proporsione un correo" })}
				helperText={errors.email?.message}
			/>
			<TextField
				id="user-name"
				label="Nombre"
				type="text"
				variant="filled"
				{...register("name", { required: "Proporsione un nombre" })}
				helperText={errors.name?.message}
			/>

			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Rol</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="user-role"
					label="role"
					variant="filled"
					defaultValue={user?.roles[0].id || undefined}
					disabled={loading}
					{...register("role")}
				>
					<MenuItem value={undefined}>Ninguno</MenuItem>
					{roles.map((role) => (
						<MenuItem value={role.id} key={role.id}>
							{role.name}
						</MenuItem>
					))}
				</Select>
				<FormHelperText>{errors.role?.message}</FormHelperText>
			</FormControl>

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
					{...register("password", {
						required: user !== undefined ? false : "Proporsione una contraseña",
					})}
				/>
				<FormHelperText>{errors.password?.message}</FormHelperText>
			</FormControl>
		</div>
	);
}
