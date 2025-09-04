import { useForm } from "@inertiajs/react";
import { Alert, Box, Button, Collapse, TextField } from "@mui/material";
import { type FormEventHandler, useId, useRef } from "react";

export default function UpdatePasswordForm({
	className = "",
}: {
	className?: string;
}) {
	const passwordInput = useRef<HTMLInputElement>(null);
	const currentPasswordInput = useRef<HTMLInputElement>(null);
	const currentId = useId();
	const newPassId = useId();
	const confirmId = useId();

	const { data, setData, errors, put, reset, processing, recentlySuccessful } =
		useForm({
			current_password: "",
			password: "",
			password_confirmation: "",
		});

	const updatePassword: FormEventHandler = (e) => {
		e.preventDefault();
		put(route("password.update"), {
			preserveScroll: true,
			onSuccess: () => reset(),
			onError: (errs) => {
				if (errs.password) {
					reset("password", "password_confirmation");
					passwordInput.current?.focus();
				}
				if (errs.current_password) {
					reset("current_password");
					currentPasswordInput.current?.focus();
				}
			},
		});
	};

	return (
		<section className={className}>
			<header>
				<h2 className="text-lg font-medium text-gray-900">
					Actualizar contraseña
				</h2>
				<p className="mt-1 text-sm text-gray-600">
					Asegúrate de usar una contraseña larga y segura.
				</p>
			</header>
			<form onSubmit={updatePassword} className="mt-6">
				<Box>
					<TextField
						id={currentId}
						label="Contraseña actual"
						type="password"
						size="small"
						fullWidth
						value={data.current_password}
						onChange={(e) => setData("current_password", e.target.value)}
						autoComplete="current-password"
						inputRef={currentPasswordInput}
						error={Boolean(errors.current_password)}
						helperText={errors.current_password || " "}
					/>
				</Box>
				<Box>
					<TextField
						id={newPassId}
						label="Nueva contraseña"
						type="password"
						size="small"
						fullWidth
						value={data.password}
						onChange={(e) => setData("password", e.target.value)}
						autoComplete="new-password"
						inputRef={passwordInput}
						error={Boolean(errors.password)}
						helperText={errors.password || " "}
					/>
				</Box>
				<Box>
					<TextField
						id={confirmId}
						label="Confirmar contraseña"
						type="password"
						size="small"
						fullWidth
						value={data.password_confirmation}
						onChange={(e) => setData("password_confirmation", e.target.value)}
						autoComplete="new-password"
						error={Boolean(errors.password_confirmation)}
						helperText={errors.password_confirmation || " "}
					/>
				</Box>
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
							Contraseña actualizada
						</Alert>
					</Collapse>
				</div>
			</form>
		</section>
	);
}
