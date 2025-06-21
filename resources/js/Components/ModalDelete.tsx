import { Close } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Modal from "./Modal";

type Props = {
	show: boolean;
	title: string;
	id: number | null;
	onDeleteConfirm: (id: number) => void;
	setOpen: () => void;
};

export default function ModalDelete({
	show,
	setOpen,
	title,
	id,
	onDeleteConfirm,
}: Props) {
	return (
		<Modal show={show} onClose={setOpen} maxWidth="sm">
			<div className="max-h-dvh flex flex-col">
				<div className="border-b border-b-gray-300 py-2 px-4 text-xl bg-gray-100 flex">
					<h2 className="font-bold">Eliminar</h2>
					<span className="mx-auto"></span>
					<button type="button" onClick={setOpen}>
						<Close />
					</button>
				</div>
				<div className="p-3 overflow-x-hidden overflow-y-scroll">
					<p>
						¿Seguro que desea eliminar{" "}
						<span className="font-bold">
							({title} - ID: {id})
						</span>
						?
					</p>
				</div>
				<div className="border-t border-t-gray-300 py-2 px-4 bg-gray-100 md:flex">
					<div className="max-md:mt-2">
						<Button
							size="medium"
							variant="contained"
							color="error"
							endIcon={<DeleteIcon />}
							onClick={() => {
								if (id !== null) onDeleteConfirm(id);
							}}
							className="w-auto max-md:w-full"
						>
							<b>Eliminar</b>
						</Button>
					</div>

					<div className="ml-auto w-full mt-2 md:mt-0 md:w-auto">
						<Button
							size="medium"
							variant="contained"
							onClick={setOpen}
							className="w-full"
						>
							<b>Cancelar</b>
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
