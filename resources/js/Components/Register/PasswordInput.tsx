import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, {
	type TooltipProps,
	tooltipClasses,
} from "@mui/material/Tooltip";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		fontSize: theme.typography.pxToRem(12),
	},
}));

export default function PasswordInput() {
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<HtmlTooltip
				open={open}
				onClose={() => setOpen(false)}
				title={
					<React.Fragment>
						<Typography color="inherit">Tooltip with HTML</Typography>
						<em>{"And here's"}</em> <b>{"some"}</b> <u>{"amazing content"}</u>.{" "}
						{"It's very engaging. Right?"}
					</React.Fragment>
				}
				arrow
			>
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
			</HtmlTooltip>
		</div>
	);
}
