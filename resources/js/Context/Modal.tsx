import { Box, Modal, type SxProps } from "@mui/material";
import { createContext, type ReactNode, useContext, useState } from "react";

type Props = {
	children: ReactNode;
};

/*
 * Tipo de función que recibe el contenido del modal y cierra el modal
 * closeModal: Función para cerrar el modal
 */
type Utils = (utils: { closeModal: () => void }) => ReactNode;

/*
 * Tipo ModalContextType
 * openModal: Función para abrir el modal
 * closeModal: Función para cerrar el modal
 */
interface ModalContextType {
	openModal: (getContentFn: Utils) => void;
	closeModal: () => void;
}

const style: SxProps = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	overflow: "hidden",
};

/*
 * Contexto ModalContext
 * Usado para almacenar el estado del Modal
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/*
 * Componente ModalProvider
 * Usado para proveer el contexto ModalContext
 */
export function ModalProvider({ children }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [getContent, setGetContent] = useState<
		(utils: { closeModal: () => void }) => ReactNode
	>(() => () => null);

	const openModal = (
		getContentFn: (utils: { closeModal: () => void }) => ReactNode,
	) => {
		setGetContent(() => getContentFn);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setTimeout(() => setGetContent(() => () => null), 300); // resetear el contenido después de cerrar (para limpiar estado)
	};

	return (
		<ModalContext.Provider value={{ openModal, closeModal }}>
			{children}
			{isOpen && (
				<Modal open={isOpen} onClose={closeModal} className="rounded-2xl">
					<Box sx={style}>{getContent({ closeModal })}</Box>
				</Modal>
			)}
		</ModalContext.Provider>
	);
}

/*
 * Usar ModalContext para obtener el contexto del ModalProvider
 * Si no se encuentra, lanzar un error
 * Si se encuentra, retornar el contexto
 */
export function useModal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
}
