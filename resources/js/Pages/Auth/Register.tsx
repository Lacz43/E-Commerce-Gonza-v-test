import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";
import { TextField, Button } from "@mui/material";

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("register"), {
			onFinish: () => reset("password", "password_confirmation"),
		});
	};

	return (
		<GuestLayout>
			<Head title="Register" />

			<form onSubmit={submit} className="w-full">
				<div>
					<TextField
						id="name"
						label="Nombre"
						type="text"
						className="w-full"
						autoComplete="username"
						size="small"
						onChange={(e) => setData("name", e.target.value)}
						error={!!errors.name}
					/>

					<InputError message={errors.name} className="mt-2" />
				</div>

				<div className="mt-4">
					<TextField
						id="email"
						label="Correo Eletronico"
						type="email"
						className="w-full"
						autoComplete="username"
						value={data.email}
						size="small"
						onChange={(e) => setData("email", e.target.value)}
						error={!!errors.email}
					/>

					<InputError message={errors.email} className="mt-2" />
				</div>

				<div className="mt-4">
					<TextField
						id="password"
						label="Contraseña"
						type="password"
						className="w-full"
						value={data.password}
						size="small"
						autoComplete="new-password"
						onChange={(e) => setData("password", e.target.value)}
						error={!!errors.password}
					/>

					<InputError message={errors.password} className="mt-2" />
				</div>

				<div className="mt-4">
					<TextField
						id="password_confirmation"
						label="Confirmar contraseña"
						type="password"
						className="w-full"
						value={data.password_confirmation}
						size="small"
						autoComplete="new-password"
						onChange={(e) => setData("password_confirmation", e.target.value)}
						error={!!errors.password_confirmation}
					/>

					<InputError message={errors.password_confirmation} className="mt-2" />
				</div>

				<div className="mt-5">
					<Button
						size="medium"
						variant="contained"
						className="w-full"
						type="submit"
						disabled={processing}
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
