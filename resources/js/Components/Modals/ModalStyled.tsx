import { Close } from "@mui/icons-material";
import type { JSX } from "react";

type Props = {
	header: JSX.Element;
	body: JSX.Element | JSX.Element[];
	footer: JSX.Element | JSX.Element[];
	onClose: () => void;
};

export default function ModalStyled(props: Props) {
	const { header, body, footer } = props;
	return (
		<div>
			<div className="max-h-dvh flex flex-col">
				<div className="border-b border-b-gray-300 py-2 px-4 text-xl bg-gray-100 flex justify-between">
					{header}
					<button type="button" onClick={() => props.onClose()}>
						<Close />
					</button>
				</div>
				<div className="p-3 overflow-x-hidden overflow-y-scroll">{body}</div>
				<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100 md:flex">
					{footer}
				</div>
			</div>
		</div>
	);
}
