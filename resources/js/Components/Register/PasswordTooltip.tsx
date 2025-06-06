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
	title: React.ReactElement | React.ReactElement[];
};

export default function PasswordTooltip({
	children,
	open,
	setOpen,
	title,
}: Props) {
	return (
		<HtmlTooltip open={open} onClose={setOpen} title={title} arrow>
			{children}
		</HtmlTooltip>
	);
}
