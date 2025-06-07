import { useState } from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<T extends FieldValues> = {
	className?: string;
	control: Control<T>;
	name: Path<T>;
	confirm: string;
};

export default function PasswordInput<T extends FieldValues>({
	className,
	control,
	name,
	confirm,
}: Props<T>) {
	const [open, setOpen] = useState(false);

	return (
		<div className={className}>
			<Controller
				name={name}
				control={control}
				rules={{
					required: "Es requerido confirmar su contraseña ",
					validate: {
						confirmPassword: (value) =>
							confirm === value || "Las contraseñas no coinciden",
					},
				}}
				render={({ fieldState: { error }, field }) => (
					<PasswordTooltip
						open={confirm === field.value ? false : open}
						setOpen={() => setOpen(false)}
						title={<div>Las contraseñas no coinciden</div>}
					>
						<TextField
							id={name}
							label="Confirmar contrasea"
							type="password"
							className="w-full"
							size="small"
							autoComplete="new-password"
							error={error !== undefined}
							helperText={error?.message}
							{...field}
							onBeforeInput={() => setOpen(true)}
							onMouseEnter={() => setOpen(true)}
						/>
					</PasswordTooltip>
				)}
			/>
		</div>
	);
}
