import * as React from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";

type Props = {
	className?: string;
};

export default function PasswordInput({ className }: Props) {
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
					onBeforeInput={() => setOpen(true)}
					onMouseEnter={() => setOpen(true)}
				/>
			</PasswordTooltip>
		</div>
	);
}
