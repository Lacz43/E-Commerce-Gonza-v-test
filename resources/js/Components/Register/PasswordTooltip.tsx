import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, {
	type TooltipProps,
	tooltipClasses,
} from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		fontSize: theme.typography.pxToRem(12),
	},
}));

type Props = {
	children: React.ReactElement;
    open: boolean;
    setOpen: () => void;
};

export default function PasswordTooltip({ children, open, setOpen }: Props) {
	return (
		<div>
			<HtmlTooltip
				open={open}
				onClose={setOpen}
				title={
					<React.Fragment>
						<Typography color="inherit">Tooltip with HTML</Typography>
						<em>{"And here's"}</em> <b>{"some"}</b> <u>{"amazing content"}</u>.{" "}
						{"It's very engaging. Right?"}
					</React.Fragment>
				}
				arrow
			>
				{children}
			</HtmlTooltip>
		</div>
	);
}
