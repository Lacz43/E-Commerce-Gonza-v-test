import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";

export default function Login({
	status,
	canResetPassword,
}: {
	status?: string;
	canResetPassword: boolean;
}) {
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		password: "",
		remember: false as boolean,
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("login"), {
			onFinish: () => reset("password"),
		});
	};

	return (
		<GuestLayout>
			<title>Log In</title>

			{status && (
				<div className="mb-4 text-sm font-medium text-green-600">{status}</div>
			)}

			<form onSubmit={submit} className="w-full">
				<div>
					<TextField
						id="outlined-required"
						label="Correo Eletronico"
						type="email"
						className="w-full"
						autoComplete="username"
						value={data.email}
						size="small"
						onChange={(e) => setData("email", e.target.value)}
						error={!!errors.email}
					/>

					<InputError message={errors.email} className="mt-1" />
				</div>

				<div className="mt-4">
					<TextField
						id="password"
						label="Contraseña"
						type="password"
						className="w-full"
						value={data.password}
						size="small"
						autoComplete="current-password"
						onChange={(e) => setData("password", e.target.value)}
						error={!!errors.password}
					/>
					<InputError message={errors.password} className="mt-1" />
				</div>

				<div className="mt-1 block">
					<FormControlLabel
						control={
							<Checkbox
								checked={data.remember}
								onChange={(e) =>
									setData("remember", (e.target.checked || false) as false)
								}
							/>
						}
						label="Recuerdame"
					/>
				</div>
				<Button
					size="medium"
					variant="contained"
					className="w-full"
                    type="submit"
                    disabled={processing}
				>
				    <b>Iniciar sesión</b>
				</Button>

				<div className="mt-4 flex items-center justify-end">
					{canResetPassword && (
						<Link
							href={route("password.request")}
							className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							¿Olvidaste tu contraseña?
						</Link>
					)}
				</div>
			</form>
		</GuestLayout>
	);
}
