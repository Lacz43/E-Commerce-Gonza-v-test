import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShowIcon from "@mui/icons-material/Preview";
import { IconButton, Tooltip } from "@mui/material";

type Props = {
	type: "show" | "delete" | "edit";
	onClick?: () => void;
};

export default function CrudButton({ type, onClick }: Props) {
	const color = {
		show: "primary",
		edit: "primary",
		delete: "error",
	} as const;

	const label = {
		show: "Detalles",
		edit: "Editar",
		delete: "Eliminar",
	} as const;
	return (
		<Tooltip title={label[type]}>
			<IconButton
				color={color[type] || "primary"}
				onClick={(e) => {
					e.stopPropagation();
					onClick?.();
				}}
			>
				{type === "edit" && <EditIcon />}
				{type === "delete" && <DeleteIcon />}
				{type === "show" && <ShowIcon />}
			</IconButton>
		</Tooltip>
	);
}
