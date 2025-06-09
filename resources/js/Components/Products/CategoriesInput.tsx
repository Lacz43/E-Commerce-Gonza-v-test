import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import type {
	Path,
	FieldValues,
	Control,
	UseFormSetValue,
    PathValue,
} from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";

type Props<T extends FieldValues> = {
	className?: string;
	name: Path<T>;
	control: Control<T>;
	setValue: UseFormSetValue<T>;
};

type Category = { id: number; name: string };

export default function CategoryInput<T extends FieldValues>({
	className,
	name,
	control,
	setValue,
}: Props<T>) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAutocompleteChange = (
		_event: React.SyntheticEvent,
		newValue: string | Category | null,
	) => {
		if (newValue === null) {
			setValue(name, null as PathValue<T, Path<T>>); // Limpiar el campo
			return;
		}

		if (typeof newValue === "string") {
			// Caso 1: El usuario ingresó un texto nuevo
			setValue(name, newValue as PathValue<T, Path<T>>); // Almacenar el texto directamente
		} else {
			// Caso 2: El usuario seleccionó una categoría existente
			setValue(name, newValue.id as PathValue<T, Path<T>>); // Almacenar solo el ID
		}
	};

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const { data } = await axios.get<Category[]>(
					route("products.categories"),
				);
				setCategories(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	return (
		<Controller
			name={name}
			control={control}
			rules={{
				required: "Este campo es obligatorio",
			}}
			defaultValue={null as PathValue<T, Path<T>>}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Autocomplete
					className={className}
					open={open}
					onOpen={handleOpen}
					onClose={handleClose}
					value={
						// Mostrar el objeto Category si el valor es un ID
						typeof value === "string"
							? categories.find((cat) => cat.id === value) || value
							: value || null
					}
					onChange={(event, newValue) => {
						handleAutocompleteChange(event, newValue);
					}}
					isOptionEqualToValue={(option, value) => option.name === value.name}
					getOptionLabel={(option) =>
						typeof option === "string" ? option : option.name
					}
					options={categories}
					loading={loading}
					freeSolo
					renderInput={(params) => (
						<TextField
							{...params}
							label="Categoria"
							variant="filled"
							required
							error={error !== undefined}
							helperText={error?.message}
							slotProps={{
								input: {
									...params.InputProps,
									endAdornment: (
										<Fragment>
											{loading ? (
												<CircularProgress color="inherit" size={20} />
											) : null}
											{params.InputProps.endAdornment}
										</Fragment>
									),
								},
							}}
						/>
					)}
				/>
			)}
		/>
	);
}
