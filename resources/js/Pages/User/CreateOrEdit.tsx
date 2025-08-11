import { Button } from "@mui/material";
import { lazy, Suspense, useCallback, useRef } from "react";
import Form, { type FormHandle } from "./Partials/Form";

const ModalStyled = lazy(() => import("@/Components/Modals/ModalStyled"));

type Props = {
	type: "edit" | "create";
	onClose: () => void;
};

export default function Create(props: Props) {
	const ref = useRef<FormHandle>(null);

	const handleSubmit = useCallback(() => ref.current?.submit(), []);

	return (
		<Suspense>
			<ModalStyled
				onClose={props.onClose}
				header={
					<h2 className="text-xl font-semibold leading-tight text-gray-800">
						{props.type === "edit" ? "Editar" : "Crear"} Usuario
					</h2>
				}
				body={
					<div className="p-6 text-gray-900">
						<Form ref={ref} />
					</div>
				}
				footer={
					<div className="text-gray-900 flex gap-2">
						<Button onClick={props.onClose} color="info" variant="contained">
							Cancelar
						</Button>
						<Button onClick={handleSubmit} color="primary" variant="contained">
							Guardar
						</Button>
					</div>
				}
			/>
		</Suspense>
	);
}
