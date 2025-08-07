import { lazy, Suspense } from "react";

const ModalStyled = lazy(() => import("@/Components/Modals/ModalStyled"));

type Props = {
    type: "edit" | "create";
    onClose: () => void;
}

export default function Create(props: Props) {
	return (
		<Suspense>
			<ModalStyled
                onClose={props.onClose}
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
