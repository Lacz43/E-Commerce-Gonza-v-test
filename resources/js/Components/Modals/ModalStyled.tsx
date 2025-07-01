import { Close } from "@mui/icons-material";
import type { JSX } from "react";
import Modal, { type ModalProps } from "@/Components/Modals/Modal";

type Props = {
	header: JSX.Element;
	body: JSX.Element | JSX.Element[];
	footer: JSX.Element | JSX.Element[];
};

export default function ModalStyled(
	props: Props & ModalProps
) {
    const { header, body, footer, ...rest } = props;
	return (
		<Modal {...rest}>
			<div className="max-h-dvh flex flex-col">
				<div className="border-b border-b-gray-300 py-2 px-4 text-xl bg-gray-100 flex justify-between">
					{header}
					<button type="button" onClick={() => props.onClose(false)}>
						<Close />
					</button>
				</div>
				<div className="p-3 overflow-x-hidden overflow-y-scroll">{body}</div>
				<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100 md:flex">
					{footer}
				</div>
			</div>
		</Modal>
	);
}
