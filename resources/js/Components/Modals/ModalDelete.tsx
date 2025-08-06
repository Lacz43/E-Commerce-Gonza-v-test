import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ModalStyled from "./ModalStyled";

type Props = {
	title: string;
	id: number | null;
	loading?: boolean;
	onDeleteConfirm: (id: number) => void;
	onClose: () => void;
};

export default function ModalDelete({
	onClose,
	title,
	id,
	loading,
	onDeleteConfirm,
}: Props) {
	return (
		<ModalStyled
			onClose={onClose}
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Eliminar
				</h2>
			}
			body={
				<p>
					¿Seguro que desea eliminar{" "}
					<span className="font-bold">
						{title} - ID: {id}
					</span>
					?
				</p>
			}
			footer={
				<>
					<div className="max-md:mt-2">
						<Button
							size="medium"
							variant="contained"
							color="error"
							endIcon={<DeleteIcon />}
							loading={loading}
							onClick={() => {
								if (id !== null) onDeleteConfirm(id);
							}}
							className="w-auto max-md:w-full"
						>
							<b>Confirmar</b>
						</Button>
					</div>

					<div className="ml-auto w-full mt-2 md:mt-0 md:w-auto">
						<Button
							size="medium"
							variant="contained"
							onClick={onClose}
							className="w-full"
						>
							<b>Cancelar</b>
						</Button>
					</div>
				</>
			}
		/>
	);
}
