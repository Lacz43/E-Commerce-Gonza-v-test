import {
	Autocomplete,
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import axios from "axios";
import * as React from "react";

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

interface CategoryOption {
	id: number;
	name: string;
}

interface BrandOption {
	id: number;
	name: string;
}

interface InputProductSearchProps extends React.HTMLAttributes<HTMLElement> {
	onSearchChange?: (searchParams: {
		search?: string;
		id?: string;
		barcode?: string;
		name?: string;
		category?: string;
		brand?: string;
	}) => void;
}

export default function InputProductSearch({
	className,
	onSearchChange,
}: InputProductSearchProps) {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [options, setOptions] = React.useState<ProductOption[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [categories, setCategories] = React.useState<CategoryOption[]>([]);
	const [brands, setBrands] = React.useState<BrandOption[]>([]);
	const [selectedCategory, setSelectedCategory] = React.useState<string>("");
	const [selectedBrand, setSelectedBrand] = React.useState<string>("");

	// Load categories and brands on mount
	React.useEffect(() => {
		const loadFilters = async () => {
			try {
				const [categoriesResponse, brandsResponse] = await Promise.all([
					axios.get(route("products.categories")),
					axios.get(route("products.brands")),
				]);

				setCategories(categoriesResponse.data);
				setBrands(brandsResponse.data);
			} catch (error) {
				console.error("Error loading filters:", error);
			}
		};

		loadFilters();
	}, []);

	// Notify parent component when filters change
	React.useEffect(() => {
		const searchParams: {
			search?: string;
			category?: string;
			brand?: string;
		} = {};
		if (searchTerm) searchParams.search = searchTerm;
		if (selectedCategory) searchParams.category = selectedCategory;
		if (selectedBrand) searchParams.brand = selectedBrand;

		onSearchChange?.(searchParams);
	}, [searchTerm, selectedCategory, selectedBrand, onSearchChange]);

	// Función debounced para buscar productos
	const searchProducts = React.useMemo(
		() =>
			debounce(async (query: string) => {
				if (query.length < 2) {
					setOptions([]);
					return;
				}

				setLoading(true);
				try {
					const params: {
						search: string;
						perPage: number;
						minStock: number;
						useImage: boolean;
						minAvailableStock: number;
						whitReviews: boolean;
						category?: string;
						brand?: string;
					} = {
						search: query,
						perPage: 10,
						minStock: 1,
						useImage: true,
						minAvailableStock: 1,
						whitReviews: true,
					};

					if (selectedCategory) params.category = selectedCategory;
					if (selectedBrand) params.brand = selectedBrand;

					const response = await axios.get(route("products"), { params });

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
				} catch (error) {
					console.error("Error searching products:", error);
					setOptions([]);
				} finally {
					setLoading(false);
				}
			}, 500),
		[selectedCategory, selectedBrand],
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
			const searchParams: {
				search?: string;
				category?: string;
				brand?: string;
			} = {};
			if (searchValue) searchParams.search = searchValue;
			if (selectedCategory) searchParams.category = selectedCategory;
			if (selectedBrand) searchParams.brand = selectedBrand;
			onSearchChange?.(searchParams);
		}
	};

	const handleCategoryChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		setSelectedCategory(event.target.value as string);
	};

	const handleBrandChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedBrand(event.target.value as string);
	};

	return (
		<Box
			className={className}
			sx={{ 
				display: "flex", 
				flexDirection: "column", 
				gap: 2,
				alignItems: "center",
				width: "100%"
			}}
		>
			{/* Filter selects */}
			<Box sx={{ 
				display: "flex", 
				gap: 2, 
				flexWrap: "wrap",
				justifyContent: "center",
				width: "100%",
				maxWidth: 800
			}}>
				<FormControl 
					size="small" 
					sx={{ 
						minWidth: 200,
						flex: 1,
						maxWidth: 300
					}}
				>
					<InputLabel sx={{ backgroundColor: "transparent" }}>Categoría</InputLabel>
					<Select
						value={selectedCategory}
						label="Categoría"
						onChange={handleCategoryChange}
						sx={{
							borderRadius: "12px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							backdropFilter: "blur(8px)",
							"&:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.95)",
							},
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(251, 146, 60, 0.3)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(251, 146, 60, 0.6)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(251, 146, 60)",
							},
						}}
					>
						<MenuItem value="">
							<em>Todas las categorías</em>
						</MenuItem>
						{categories.map((category) => (
							<MenuItem key={category.id} value={category.id.toString()}>
								{category.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl 
					size="small" 
					sx={{ 
						minWidth: 200,
						flex: 1,
						maxWidth: 300
					}}
				>
					<InputLabel sx={{ backgroundColor: "transparent" }}>Marca</InputLabel>
					<Select
						value={selectedBrand}
						label="Marca"
						onChange={handleBrandChange}
						sx={{
							borderRadius: "12px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							backdropFilter: "blur(8px)",
							"&:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.95)",
							},
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(16, 185, 129, 0.3)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(16, 185, 129, 0.6)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(16, 185, 129)",
							},
						}}
					>
						<MenuItem value="">
							<em>Todas las marcas</em>
						</MenuItem>
						{brands.map((brand) => (
							<MenuItem key={brand.id} value={brand.id.toString()}>
								{brand.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Product search autocomplete */}
			<Autocomplete
				options={options}
				getOptionLabel={(option) => {
					if (typeof option === "string") {
						return option;
					}
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
										<div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full mr-2" />
									) : null}
									{params.InputProps.endAdornment}
								</>
							),
						}}
						sx={{
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							backdropFilter: "blur(8px)",
							borderRadius: "12px",
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(251, 146, 60, 0.3)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(251, 146, 60, 0.6)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgb(251, 146, 60)",
							},
						}}
					/>
				)}
				renderOption={(props, option) => {
					const { key, ...optionProps } = props;
					return (
						<li key={key} {...optionProps}>
							<div className="flex flex-col py-1">
								<span className="font-medium text-slate-800">
									{typeof option === "string" ? option : option.name}
								</span>
								{typeof option === "object" && option.barcode && (
									<span className="text-sm text-slate-500">
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
					maxWidth: 800,
					"& .MuiOutlinedInput-root": {
						borderRadius: "12px",
					},
					"& .MuiAutocomplete-paper": {
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						backdropFilter: "blur(8px)",
						borderRadius: "12px",
						boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
					},
				}}
			/>
		</Box>
	);
}
