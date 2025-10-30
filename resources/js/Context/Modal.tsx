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
	// Abre un modal y devuelve su id
	openModal: (getContentFn: Utils) => string;
	// Cierra un modal por id; si no se pasa id, cierra el último (backward compatible)
	closeModal: (id?: string) => void;
	// Cierra todos los modales abiertos
	closeAll: () => void;
}

const style: SxProps = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "95vw", sm: "auto" },
	maxWidth: { xs: "none"},
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
type ModalEntry = { id: string; getContent: Utils };

export function ModalProvider({ children }: Props) {
	const [modals, setModals] = useState<ModalEntry[]>([]);

	const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

	const openModal = (getContentFn: Utils) => {
		const id = genId();
		setModals((prev) => [...prev, { id, getContent: getContentFn }]);
		return id;
	};

	const closeModal = (id?: string) => {
		setModals((prev) => {
			if (!prev.length) return prev;
			if (!id) return prev.slice(0, -1);
			return prev.filter((m) => m.id !== id);
		});
	};

	const closeAll = () => setModals([]);

	return (
		<ModalContext.Provider value={{ openModal, closeModal, closeAll }}>
			{children}
			{modals.map((m, idx) => (
				<Modal
					key={m.id}
					open
					onClose={() => closeModal(m.id)}
					className="rounded-2xl"
				>
					<Box sx={{ ...style, zIndex: 1300 + idx }}>
						{m.getContent({ closeModal: () => closeModal(m.id) })}
					</Box>
				</Modal>
			))}
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
