import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import type { FieldValues, Path } from "react-hook-form";
import SelectProduct from "@/Components/Products/SelectProduct";
import { useModal } from "@/Context/Modal";
import CreateForm from "@/Pages/Products/Partials/Form";

type Props<T extends FieldValues> = {
	name: Path<T>;
	id?: number;
};

export default function ProductSelector<T extends FieldValues>({
	name,
	id,
}: Props<T>) {
	const { openModal } = useModal();

	const createProduct = () => {
		openModal(() => <CreateForm onSubmit={() => {}} />);
	};

	return (
		<div className="flex gap-4 w-full">
			<SelectProduct<T> name={name} id={id} />
			<Tooltip title="Crear nuevo producto">
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={createProduct}
				>
					Crear
				</Button>
			</Tooltip>
		</div>
	);
}
