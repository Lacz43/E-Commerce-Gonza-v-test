import * as React from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

type Props = {
	className?: string;
	register: UseFormRegisterReturn<string>;
	errors: FieldError | undefined;
};

export default function PasswordInput({ className, register, errors }: Props) {
	const [open, setOpen] = React.useState(false);
	return (
		<div className={className}>
			<PasswordTooltip open={open} setOpen={() => setOpen(false)}>
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
