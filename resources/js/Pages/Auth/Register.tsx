import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { TextField, Button } from "@mui/material";
import PasswordInput from "@/Components/Register/PasswordInput";
import PasswordConfirmInput from "@/Components/Register/PasswordConfirmInput";
import { useForm } from "react-hook-form";
import routerAsync from "@/Hook/routerAsync";
import { useState } from "react";

type FormStruture = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export default function Register() {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

    const [password, setPassword] = useState("");

	async function onSubmit(data: FormStruture) {
		try {
			await routerAsync("post", route("register"), data);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<GuestLayout>
			<Head title="Register" />

			<form onSubmit={handleSubmit(onSubmit)} className="w-full">
				<div>
					<TextField
						id="name"
						label="Nombre"
						type="text"
						className="w-full"
						autoComplete="username"
						size="small"
						{...register("name", {
							required: "Necesitas proporcionar un nombre.",
						})}
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
				</div>

				<div className="mt-4">
					<TextField
						id="email"
						label="Correo Eletronico"
						type="email"
						className="w-full"
						autoComplete="username"
						size="small"
						{...register("email", {
							required: "Necesitas proporcionar un Correo Eletronico",
						})}
						error={!!errors.email}
						helperText={errors.email?.message}
					/>
				</div>

				<PasswordInput<FormStruture>
					className="mt-4"
					control={control}
					name="password"
                    changePassword={(pass) => setPassword(pass)}
				/>
				<PasswordConfirmInput<FormStruture>
					className="mt-4"
					control={control}
					name="password_confirmation"
					confirm={password}
				/>

				<div className="mt-5">
					<Button
						size="medium"
						variant="contained"
						className="w-full"
						type="submit"
						disabled={isSubmitting}
					>
						<b>Registrarse</b>
					</Button>
				</div>

				<div className="mt-4 flex items-center justify-end">
					<Link
						href={route("login")}
						className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						¿Ya estas registrado?
					</Link>
				</div>
			</form>
		</GuestLayout>
	);
}
