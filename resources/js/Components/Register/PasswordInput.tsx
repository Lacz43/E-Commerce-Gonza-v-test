import * as React from "react";
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
	const [open, setOpen] = React.useState(false);
	return (
		<div className={className}>
			<PasswordTooltip
				open={open}
				setOpen={() => setOpen(false)}
				title={
					<div>
						<p>
							<span>{Check(false)}</span>
							minimo de 8 caracteres
						</p>
						<p>
							<span>{Check(false)}</span>1 caracter en mayuscula
						</p>
						<p>
							<span>{Check(false)}</span>1 caracter alfa numerico
						</p>
						<p>
							<span>{Check(false)}</span>1 caracter especial
						</p>
						<p>
							<span>{Check(false)}</span>1 caracter en minuscula
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
					onBeforeInput={() => setOpen(true)}
					onMouseEnter={() => setOpen(true)}
				/>
			</PasswordTooltip>
		</div>
	);
}
