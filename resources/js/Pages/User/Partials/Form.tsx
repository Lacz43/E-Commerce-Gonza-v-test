import { router } from "@inertiajs/react";
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
import { Controller, useForm } from "react-hook-form";
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
		setError,
		control,
	} = useForm<FormStructure>({
		defaultValues: {
			...user,
			role: (user?.roles?.[0]?.id as number | undefined) ?? undefined,
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

	const handleSubmitForm = useCallback(
		async (data: FormStructure) => {
			// Normalizar role (evitar "" y mandar undefined)
			const payload = {
				...data,
				role: data.role === ("" as unknown) ? undefined : data.role,
			};
			try {
				if (user) {
					// update
					const { data: resp } = await axios.put(
						route("users.update", user.id),
						payload,
					);
					toast.success(resp.message || "Usuario actualizado");
				} else {
					// create
					const { data: resp } = await axios.post(
						route("users.store"),
						payload,
					);
					toast.success(resp.message || "Usuario creado");
				}
				router.reload();
			} catch (e) {
				if (e instanceof AxiosError) {
					if (e.response?.status === 422) {
						const valErrors = e.response.data.errors || {};
						Object.keys(valErrors).forEach((field) => {
							setError(field as keyof FormStructure, {
								message: valErrors[field][0],
							});
						});
					}
					toast.error(e.response?.data.message || "Error al guardar usuario");
				} else {
					toast.error("Error inesperado");
				}
			}
		},
		[user, setError],
	);

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

			<Controller
				name="role"
				control={control}
				render={({ field }) => (
					<FormControl fullWidth>
						<InputLabel id="role-label">Rol</InputLabel>
						<Select
							labelId="role-label"
							id="user-role"
							label="Rol"
							variant="filled"
							disabled={loading}
							{...field}
							value={field.value === undefined ? "" : field.value}
						>
							<MenuItem value="">Ninguno</MenuItem>
							{roles.map((role) => (
								<MenuItem value={role.id} key={role.id}>
									{role.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{errors.role?.message}</FormHelperText>
					</FormControl>
				)}
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
					{...register("password", {
						required: user !== undefined ? false : "Proporsione una contraseña",
					})}
				/>
				<FormHelperText>{errors.password?.message}</FormHelperText>
			</FormControl>
		</div>
	);
}
