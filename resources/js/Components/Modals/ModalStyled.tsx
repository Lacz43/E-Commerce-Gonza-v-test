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
	backgroundColor: "rgba(5, 150, 105, 0.2)",
	transition: "all 0.3s ease",
	"&:hover": {
		backgroundColor: "rgba(5, 150, 105, 0.3)",
		transform: "rotate(90deg)",
	},
};

export default function ModalStyled(props: Props) {
	const { header, body, footer } = props;
	return (
		<div className="animate-fadeIn">
			<div className="max-h-dvh flex flex-col rounded-xl overflow-hidden shadow-2xl border border-emerald-200/50">
				{/* Header con gradiente moderno */}
				<div className="py-4 px-6 text-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 flex justify-between items-center text-white shadow-lg">
					<div className="font-bold tracking-tight flex items-center gap-2">
						{header}
					</div>
					<IconButton
						aria-label="Cerrar"
						size="small"
						onClick={props.onClose}
						sx={IconStyle}
						className="hover:scale-110 transition-transform"
					>
						<Close fontSize="small" sx={{ color: "white" }} />
					</IconButton>
				</div>

				{/* Body con mejor espaciado y scrollbar personalizado */}
				<div className="p-6 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-white via-emerald-50/30 to-white scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
					{body}
				</div>

				{/* Footer con diseño moderno */}
				<div className="py-4 px-6 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-t border-emerald-200/50 md:flex gap-3 items-center justify-end shadow-inner">
					{footer}
				</div>
			</div>
		</div>
	);
}
