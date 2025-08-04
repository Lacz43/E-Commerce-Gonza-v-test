import { lazy, Suspense } from "react";
import type { ModalProps } from "@/Components/Modals/Modal";

const ModalStyled = lazy(() => import("@/Components/Modals/ModalStyled"));

type Props = ModalProps & {
    type: "edit" | "create";
}

export default function Create(props: Props) {
	return (
		<Suspense>
			<ModalStyled
				{...props}
				header={
					<h2 className="text-xl font-semibold leading-tight text-gray-800">
					    {props.type === "edit" ? "Editar" : "Crear"} Usuario
					</h2>
				}
				body={<div className="p-6 text-gray-900"></div>}
				footer={<div className="p-6 text-gray-900"></div>}
			/>
		</Suspense>
	);
}
