import { Box, Skeleton, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import {
	type HTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Controller,
	type FieldValues,
	type Path,
	useFormContext,
} from "react-hook-form";
import toast from "react-hot-toast";
import AutocompleteInput from "@/Components/AutocompleteInput";
import { imageUrl } from "@/utils";

export function OptionItem(
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

type Props<T extends FieldValues> = {
	id?: number;
	name: Path<T>;
};

export default function SelectProduct<T extends FieldValues>({
	id,
	name,
}: Props<T>) {
	const { control, setError } = useFormContext<T>();
	const [options, setOptions] = useState<Item[]>([]);
	const [loading, setLoading] = useState(false);

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
				}
			} catch (e) {
				console.error("Error cargando productos", e);
				toast.error(
					`Error cargando productos: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
				);
				setError(name, { message: "Error cargando productos" });
			} finally {
				setLoading(false);
			}
		},
		[name],
	);

	const timeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		loadData({ id });
		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, [id, loadData]);

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
		<Controller
			name={name}
			control={control}
			rules={{ required: "Este campo es obligatorio" }}
			render={({ field: { value, onChange }, fieldState: { error } }) => (
				<AutocompleteInput<Item>
					value={options.find((o) => o?.id === value) ?? null}
					onChange={(_e, val) => {
						if (val === null) loadData();
						onChange(val ? val.id : "");
					}}
					title="Producto"
					onInput={handleSearch}
					options={options}
					loading={loading}
					error={!!error}
					helperText={error?.message as string}
					isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
					getOptionLabel={(opt) => opt?.name ?? ""}
					renderOption={(props, option) => (
						<OptionItem {...props} option={option} key={option.id} />
					)}
					disabled={id !== undefined}
				/>
			)}
		/>
	);
}
