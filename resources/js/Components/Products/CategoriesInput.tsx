import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import type { Path, FieldValues, Control, PathValue } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";

type Category = { id: number; name: string };

type Props<T extends FieldValues> = {
	className?: string;
	name: Path<T>;
	control: Control<T>;
};

export default function CategoryInput<T extends FieldValues>({
	className,
	name,
	control,
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
							? categories.find((cat) => String(cat.id) === value)?.name ||
								value
							: value || null
					}
					onChange={(_event, newValue) => {
						if (newValue === null) {
							onChange(null); // Limpiar el campo
							return;
						}

						onChange((newValue as Category).id.toString());
					}}
					onInputChange={(event, newValue) => {
						onChange(event, newValue);
					}}
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
