import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
	className?: string;
	register: UseFormRegisterReturn<string>;
	errors: FieldError | undefined;
};

function Check(checked: boolean) {
	if (checked) return <CheckIcon />;
	return <CloseIcon />;
}

export default function PasswordInput({ className, register, errors }: Props) {
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
		register.onChange(e); // Asegura que el form library reciba el valor
	};

	return (
		<div className={className}>
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
					error={errors !== undefined}
					helperText={errors?.message}
					{...register}
					onChange={handlePasswordChange}
					onBeforeInput={() => setOpen(true)}
					onMouseEnter={() => setOpen(true)}
				/>
			</PasswordTooltip>
		</div>
	);
}
