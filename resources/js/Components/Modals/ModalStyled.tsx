import { Close } from "@mui/icons-material";
import type { SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import type { JSX } from "react";

type Props = {
	header: JSX.Element;
	body: JSX.Element | JSX.Element[];
	footer: JSX.Element | JSX.Element[];
	onClose: () => void;
};

const IconStyle: SxProps = {
    backgroundColor: "rgba(31, 71, 0, 1)",
}

export default function ModalStyled(props: Props) {
	const { header, body, footer } = props;
	return (
		<div>
			<div className="max-h-dvh flex flex-col">
				<div className="py-2 px-4 text-xl bg-green-600 flex justify-between text-white">
					{header}
					<IconButton
						aria-label="Cerrar"
						size="small"
						onClick={props.onClose}
						sx={IconStyle}
					>
						<Close fontSize="small" sx={{ color: "white" }} />
					</IconButton>
				</div>
				<div className="p-3 overflow-x-hidden overflow-y-scroll">{body}</div>
				<div className="py-2 px-4 bg-green-100 md:flex">{footer}</div>
			</div>
		</div>
	);
}
