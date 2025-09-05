import { Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AutocompleteInput from "@/Components/AutocompleteInput";
import ModalStyled from "@/Components/Modals/ModalStyled";

type Props = {
	id?: number;
	onClose: () => void;
};

type FormData = {
	product: number | null;
	stock: number;
};

type Options =
	| {
			label: string;
			value: number;
	  }
	| undefined;

export default function ModalEdit({ onClose, id }: Props) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		setError,
	} = useForm<FormData>({
		defaultValues: { product: null, stock: 0 },
	});

	const [options, setOptions] = useState<Options[]>([]);
	const [loading, setLoading] = useState(false);

	const onSubmit = (data: FormData) => {
		console.log("Submitted data:", data);
		toast.success("Inventario actualizado correctamente");
	};

	interface loadDataParams {
		id?: number;
		search?: string;
		barcode?: string;
	}

	const loadData = useCallback(
		async ({ id, search, barcode }: loadDataParams = {}) => {
			setLoading(true);
			try {
				type ProductsResponse = { products: paginateResponse<Item> };
				const { data } = await axios.get<ProductsResponse>(route("products"), {
					params: { perPage: 5, id, search, barcode },
				});
				setOptions(
					data.products.data.map((item) => ({
						label: item.name,
						value: item.id,
					})) as Options[],
				);
			} catch (e) {
				console.error("Error cargando productos", e);
				toast.error(
					`Error cargando productos: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
				);
				setError("product", {
					type: "manual",
					message: "Error cargando productos",
				});
			} finally {
				setLoading(false);
			}
		},
		[setError],
	);

	const timeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		loadData();
		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, []);

	const handleSearch = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (timeout.current) clearTimeout(timeout.current);
			timeout.current = setTimeout(() => {
				loadData({ search: event.target.value });
			}, 300);
		},
		[loadData],
	);

	return (
		<ModalStyled
			onClose={onClose}
			header={<h2>Inventario {id}</h2>}
			body={
				<form className="gap-4 flex flex-col">
					<Controller
						name="product"
						control={control}
						rules={{ required: "Este campo es obligatorio" }}
						render={({ field: { value, onChange } }) => (
							<AutocompleteInput<Options>
								value={options.find((o) => o?.value === value) ?? null}
								onChange={(_e, val) => {
									if (val === null) loadData();
									onChange(val ? (val as Options)?.value : "");
								}}
								title="Producto"
								onInput={handleSearch}
								options={options}
								loading={loading}
								error={!!errors.product}
								helperText={errors.product?.message as string}
								isOptionEqualToValue={(opt, val) => opt?.value === val?.value}
								getOptionLabel={(opt) => opt?.label ?? ""}
							/>
						)}
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
