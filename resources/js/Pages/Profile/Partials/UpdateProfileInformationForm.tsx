import { Link, useForm, usePage } from "@inertiajs/react";
import { Alert, Box, Button, Collapse, TextField } from "@mui/material";
import type { FormEventHandler } from "react";
import { useId } from "react";

export default function UpdateProfileInformation({
	mustVerifyEmail,
	status,
	className = "",
}: {
	mustVerifyEmail: boolean;
	status?: string;
	className?: string;
}) {
	const user = (usePage().props as unknown as Auth).auth.user;

	const { data, setData, patch, errors, processing, recentlySuccessful } =
		useForm({
			name: user.name,
			email: user.email,
		});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		patch(route("profile.update"));
	};

	const nameId = useId();
	const emailId = useId();

	return (
		<section className={className}>
			<header>
				<h2 className="text-lg font-medium text-gray-900">
					Información del perfil
				</h2>

				<p className="mt-1 text-sm text-gray-600">
					Actualiza la información de tu perfil y tu correo electrónico.
				</p>
			</header>

			<form onSubmit={submit} className="mt-6">
				<Box>
					<TextField
						id={nameId}
						label="Nombre"
						variant="outlined"
						size="small"
						fullWidth
						value={data.name}
						onChange={(e) => setData("name", e.target.value)}
						required
						autoComplete="name"
						autoFocus
						error={Boolean(errors.name)}
						helperText={errors.name || " "}
					/>
				</Box>
				<Box>
					<TextField
						id={emailId}
						label="Email"
						type="email"
						variant="outlined"
						size="small"
						fullWidth
						value={data.email}
						onChange={(e) => setData("email", e.target.value)}
						required
						autoComplete="username"
						error={Boolean(errors.email)}
						helperText={errors.email || " "}
					/>
				</Box>

				{mustVerifyEmail && user.email_verified_at === null && (
					<div>
						<p className="mt-2 text-sm text-gray-800">
							Tu correo electrónico no está verificado.
							<Link
								href={route("verification.send")}
								method="post"
								as="button"
								className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Haz clic aquí para reenviar el correo de verificación.
							</Link>
						</p>

						{status === "verification-link-sent" && (
							<div className="mt-2 text-sm font-medium text-green-600">
								Se ha enviado un nuevo enlace de verificación a tu correo.
							</div>
						)}
					</div>
				)}

				<div className="flex items-center gap-4">
					<Button
						type="submit"
						variant="contained"
						disabled={processing}
						sx={{
							background: "linear-gradient(90deg,#FDBA74,#86EFAC)",
							color: "#0F5132",
							fontWeight: 600,
							"&:hover": {
								background: "linear-gradient(90deg,#fca860,#6ede93)",
							},
						}}
					>
						Guardar
					</Button>
					<Collapse in={recentlySuccessful} orientation="horizontal">
						<Alert
							severity="success"
							variant="outlined"
							sx={{ py: 0.5, px: 1, fontSize: 12 }}
						>
							Cambios guardados
						</Alert>
					</Collapse>
				</div>
			</form>
		</section>
	);
}
