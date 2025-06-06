import * as React from "react";
import { TextField } from "@mui/material";
import PasswordTooltip from "./PasswordTooltip";

export default function PasswordInput() {
	const [open, setOpen] = React.useState(false);
	return (
		<div>
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
