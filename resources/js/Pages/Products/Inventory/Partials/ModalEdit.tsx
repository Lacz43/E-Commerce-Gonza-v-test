import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/Components/AutocompleteInput";
import ModalStyled from "@/Components/Modals/ModalStyled";

type Props = {
	id?: number;
	onClose: () => void;
};

type FormData = {
	product: number;
	stock: number;
};

type Options = {
	label: string;
	value: number;
};

export default function ModalEdit({ onClose, id }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [options, setOptions] = useState<Options[]>([]);

	const onSubmit = useCallback((data: FormData) => {
		console.log("Submitted data:", data);
	}, []);

	interface loadDataParams {
		id?: number;
		search?: string;
		barcode?: string;
	}

	const loadData = useCallback(
		async ({ id, search, barcode }: loadDataParams = {}) => {
			type ProductsResponse = { products: paginateResponse<Item> };
			const { data } = await axios.get<ProductsResponse>(route("products"), {
				params: { perPage: 10, id, search, barcode },
			});

			setOptions(
				data.products.data.map((item) => ({
					label: item.name,
					value: item.id,
				})) as Options[],
			);
		},
		[],
	);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<ModalStyled
			onClose={onClose}
			header={<h2>Inventario {id}</h2>}
			body={
				<form className="gap-4 flex flex-col">
					<AutocompleteInput<Options>
						{...register("product", { required: "Este campo es obligatorio" })}
						title="Producto"
						options={options}
					/>
					<TextField
						{...register("stock", { required: "Este campo es obligatorio" })}
						label="Cantidad"
						type="number"
						fullWidth
						error={!!errors.stock}
						helperText={errors.stock?.message}
					/>
				</form>
			}
			footer={<Button onClick={handleSubmit(onSubmit)}>Guardar</Button>}
		/>
	);
}
