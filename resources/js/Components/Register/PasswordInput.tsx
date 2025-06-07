import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";
import type { Control, FieldValues, Path } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";

type Props<T extends FieldValues> = {
	className?: string;
	control: Control<T>;
    name: Path<T>
};

function Check(checked: boolean) {
	if (checked) return <CheckIcon />;
	return <CloseIcon />;
}

export default function PasswordInput<T extends FieldValues>({ className, control, name }: Props<T>) {
	const [open, setOpen] = useState(false);

	const [password, setPassword] = useState("");
	const [hasMinLength, setHasMinLength] = useState(false);
	const [hasUppercase, setHasUppercase] = useState(false);
	const [hasLowercase, setHasLowercase] = useState(false);
	const [hasAlphanumeric, setHasAlphanumeric] = useState(false);
	const [hasSpecialChar, setHasSpecialChar] = useState(false);

	// Validar contraseñas en tiempo real
	useEffect(() => {
		if (password.length === 0) {
			setHasMinLength(false);
			setHasUppercase(false);
			setHasLowercase(false);
			setHasAlphanumeric(false);
			setHasSpecialChar(false);
			return;
		}

		setHasMinLength(password.length >= 8);
		setHasUppercase(/[A-Z]/.test(password));
		setHasLowercase(/[a-z]/.test(password));
		setHasAlphanumeric(/\d/.test(password));
		setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
	}, [password]);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
	};

	return (
		<div className={className}>
			<Controller
				name={name}
				control={control}
				rules={{
					required: "Es requerida una contraseña",
					maxLength: { value: 12, message: "Máximo 12 caracteres" },
					minLength: { value: 8, message: "Mínimo 8 caracteres" },
					validate: {
						// Validación personalizada: al menos 1 número
						hasNumber: (value) =>
							/\d/.test(value) || "Requiere al menos un número",
						// Validación personalizada: al menos 1 caracter especial
						hasSpecialChar: (value) =>
							/[^A-Za-z0-9]/.test(value) || "Requiere un caracter especial",
						// Validación personalizada: al menos 1 mayúscula
						hasUppercase: (value) =>
							/[A-Z]/.test(value) || "Requiere una mayúscula",
						// Validación personalizada: al menos 1 minúscula
						hasLowercase: (value) =>
							/[a-z]/.test(value) || "Requiere una minúscula",
					},
				}}
				render={({ fieldState: { error }, field }) => (
					<PasswordTooltip
						open={open}
						setOpen={() => setOpen(false)}
						title={
							<div>
								<p>
									<span>{Check(hasMinLength)}</span>
									Mínimo 8 caracteres
								</p>
								<p>
									<span>{Check(hasUppercase)}</span>1 caracter en mayúscula
								</p>
								<p>
									<span>{Check(hasAlphanumeric)}</span>1 caracter alfanumérico
								</p>
								<p>
									<span>{Check(hasSpecialChar)}</span>1 caracter especial
								</p>
								<p>
									<span>{Check(hasLowercase)}</span>1 caracter en minúscula
								</p>
							</div>
						}
					>
						<TextField
							id="password"
							label="Contraseña"
							type="password"
							className="w-full"
							size="small"
							autoComplete="new-password"
							error={error !== undefined}
							helperText={error?.message}
							{...field}
							onChangeCapture={handlePasswordChange}
							onBeforeInput={() => setOpen(true)}
							onMouseEnter={() => setOpen(true)}
						/>
					</PasswordTooltip>
				)}
			/>
		</div>
	);
}
