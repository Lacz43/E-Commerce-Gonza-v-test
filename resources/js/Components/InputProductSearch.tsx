import * as React from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Función debounce nativa con método cancel
function debounce(
	func: (query: string) => Promise<void>,
	wait: number,
): ((query: string) => void) & { cancel: () => void } {
	let timeout: NodeJS.Timeout;
	const debounced = (query: string) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(query);
		}, wait);
	};
	debounced.cancel = () => {
		clearTimeout(timeout);
	};
	return debounced;
}

interface ProductOption {
	id: number;
	name: string;
	barcode?: string;
}

interface InputProductSearchProps extends React.HTMLAttributes<HTMLElement> {
	onSearchChange?: (searchParams: {
		search?: string;
		id?: string;
		barcode?: string;
		name?: string;
	}) => void;
}

export default function InputProductSearch({
	className,
	onSearchChange,
}: InputProductSearchProps) {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [options, setOptions] = React.useState<ProductOption[]>([]);
	const [loading, setLoading] = React.useState(false);

	// Función debounced para buscar productos
	const searchProducts = React.useMemo(
		() =>
			debounce(async (query: string) => {
				if (query.length < 2) {
					setOptions([]);
					onSearchChange?.({});
					return;
				}

				setLoading(true);
				try {
					const response = await axios.get(route("products"), {
						params: {
							search: query,
							perPage: 10,
							minStock: 1,
							useImage: true,
							minAvailableStock: 1,
							whitReviews: true,
						},
					});

					const products = response.data.products.data || [];
					setOptions(
						products.map(
							(product: { id: number; name: string; barcode?: string }) => ({
								id: product.id,
								name: product.name,
								barcode: product.barcode,
							}),
						),
					);

					// Notificar al componente padre sobre el cambio de búsqueda
					onSearchChange?.({ search: query });
				} catch (error) {
					console.error("Error searching products:", error);
					setOptions([]);
				} finally {
					setLoading(false);
				}
			}, 500),
		[onSearchChange],
	);

	React.useEffect(() => {
		searchProducts(searchTerm);
		return () => {
			searchProducts.cancel();
		};
	}, [searchTerm, searchProducts]);

	const handleInputChange = (
		_event: React.SyntheticEvent,
		newInputValue: string,
	) => {
		setSearchTerm(newInputValue);
	};

	const handleOptionSelect = (
		_event: React.SyntheticEvent,
		selectedOption: ProductOption | string | null,
	) => {
		if (selectedOption && typeof selectedOption === "object") {
			// Si se selecciona un producto específico del dropdown, buscar por ID
			onSearchChange?.({ id: selectedOption.id.toString() });
		} else {
			// Si se selecciona una opción "free solo" o se limpia la selección, hacer búsqueda general
			const searchValue =
				typeof selectedOption === "string" ? selectedOption : searchTerm;
			onSearchChange?.(searchValue ? { search: searchValue } : {});
		}
	};

	return (
		<Autocomplete
			className={className}
			options={options}
			getOptionLabel={(option) => {
				// Si es un string (free solo), devolver el string
				if (typeof option === "string") {
					return option;
				}
				// Si es un objeto ProductOption, devolver el nombre
				return option.name;
			}}
			onInputChange={handleInputChange}
			onChange={handleOptionSelect}
			loading={loading}
			freeSolo={true}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Buscar Productos"
					placeholder="Escribe para buscar productos..."
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? (
									<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
								) : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
			renderOption={(props, option) => {
				const { key, ...optionProps } = props;
				return (
					<li key={key} {...optionProps}>
						<div className="flex flex-col">
							<span className="font-medium">
								{typeof option === "string" ? option : option.name}
							</span>
							{typeof option === "object" && option.barcode && (
								<span className="text-sm text-gray-500">
									Código: {option.barcode}
								</span>
							)}
						</div>
					</li>
				);
			}}
			noOptionsText={
				searchTerm.length < 2
					? "Escribe al menos 2 caracteres"
					: "No se encontraron productos"
			}
			sx={{
				width: "100%",
				maxWidth: 500,
				borderRadius: "20px",
				"& .MuiOutlinedInput-root": {
					borderRadius: "20px",
				},
			}}
		/>
	);
}
