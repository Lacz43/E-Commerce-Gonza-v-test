import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";
import { TextField, Button } from "@mui/material";

export default function ForgotPassword({ status }: { status?: string }) {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("password.email"));
	};

	return (
		<GuestLayout>
			<Head title="Forgot Password" />

			<div className="mb-4 text-sm text-gray-600">
				Forgot your password? No problem. Just let us know your email address
				and we will email you a password reset link that will allow you to
				choose a new one.
			</div>

			{status && (
				<div className="mb-4 text-sm font-medium text-green-600">{status}</div>
			)}

			<form onSubmit={submit} className="w-full">
				<div className="w-full">
					<TextField
						id="email"
						label="Correo Eletronico"
						type="email"
						className="w-full"
						autoComplete="email"
						value={data.email}
						size="small"
						onChange={(e) => setData("email", e.target.value)}
						error={!!errors.email}
					/>
					<InputError message={errors.email} className="mt-2" />
				</div>

				<div className="mt-5">
					<Button
						size="medium"
						variant="contained"
						className="w-full"
						type="submit"
						disabled={processing}
					>
						<b>Enviar link</b>
					</Button>
				</div>
			</form>
		</GuestLayout>
	);
}
