import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import type { HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AutocompleteInput from "@/Components/AutocompleteInput";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { imageUrl } from "@/utils";

type Props = {
	id?: number;
	onClose: () => void;
};

type FormData = {
	product: number | null;
	stock: number;
};

// Componente para cada opción del Autocomplete con Skeleton para la imagen
function OptionItem(
	props: HTMLAttributes<HTMLLIElement> & {
		option: Item;
	},
) {
	const { option, ...liProps } = props;
	const [loaded, setLoaded] = useState(false);
	return (
		<Box
			component="li"
			{...liProps}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				py: 1,
				px: 1.5,
				borderRadius: 1,
				width: "100%",
				"&:hover": { backgroundColor: "action.hover" },
			}}
		>
			<Box
				position="relative"
				width={50}
				height={50}
				flexShrink={0}
				borderRadius={1}
				overflow="hidden"
			>
				{!loaded && (
					<Skeleton
						variant="rectangular"
						width={50}
						height={50}
						animation="wave"
					/>
				)}
				<Box
					component="img"
					alt={option?.name ?? ""}
					src={imageUrl(option?.default_image?.image ?? "")}
					onLoad={() => setLoaded(true)}
					sx={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						display: loaded ? "block" : "none",
					}}
				/>
			</Box>
			<Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
				<Typography variant="body2" fontWeight={500} noWrap>
					{option?.name}
				</Typography>
				<Typography variant="caption" color="text.secondary" noWrap>
					{option?.barcode}
				</Typography>
			</Box>
		</Box>
	);
}

export default function ModalEdit({ onClose, id }: Props) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		setError,
		setValue,
	} = useForm<FormData>({
		defaultValues: { product: id || null, stock: 0 },
	});

	const [options, setOptions] = useState<Item[]>([]);
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
				console.log("Productos cargados:", data.products.data);
				setOptions(data.products.data);
				if (id) {
					const product = data.products.data.find((p) => p.id === id);
					console.log("Producto cargado:", product);
					if (product) {
						setValue("stock", product.product_inventory?.stock ?? 0);
					}
				}
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
		[setError, setValue],
	);

	const timeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		loadData({ id });
		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, [id]);

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
				<form className="gap-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name="product"
						control={control}
						rules={{ required: "Este campo es obligatorio" }}
						render={({ field: { value, onChange } }) => (
							<AutocompleteInput<Item>
								value={options.find((o) => o?.id === value) ?? null}
								onChange={(_e, val) => {
									if (val === null) loadData();
									onChange(val ? val.id : "");
									if (val) {
										setValue("stock", val.product_inventory?.stock ?? 0);
									}
								}}
								title="Producto"
								onInput={handleSearch}
								options={options}
								loading={loading}
								error={!!errors.product}
								helperText={errors.product?.message as string}
								isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
								getOptionLabel={(opt) => opt?.name ?? ""}
								renderOption={(props, option) => (
									<OptionItem {...props} option={option} />
								)}
								disabled={id !== undefined}
							/>
						)}
					/>

					<TextField
						{...register("stock", {
							required: "Este campo es obligatorio",
							valueAsNumber: true,
							validate: {
								noCero: (v) =>
									(typeof v === "number" && !Number.isNaN(v) && v !== 0) ||
									"No puede ser 0",
								entero: (v) => Number.isInteger(v) || "Solo números enteros",
							},
						})}
						label="Cantidad"
						type="number"
						onKeyDown={(e) => {
							if ([".", ",", "+", "e", "E"].includes(e.key)) {
								e.preventDefault();
							}
						}}
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
