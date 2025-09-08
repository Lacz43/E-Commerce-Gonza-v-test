import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import usePermissions from "@/Hook/usePermissions";

type Data = { id: number; name: string };

type Props<T extends FieldValues> = {
	className?: string;
	name: Path<T>;
	control: Control<T>;
	permissions: string[];
	url: string;
	label: string;
};

export default function CategoryInput<T extends FieldValues>({
	className,
	name,
	control,
	permissions,
	url,
	label,
}: Props<T>) {
	const [categories, setCategories] = useState<Data[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const { hasPermission } = usePermissions();

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
				const { data } = await axios.get<Data[]>(url);
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
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				if (
					value !== null &&
					typeof value === "object" &&
					"name" in value &&
					typeof value.name === "string"
				) {
					// Si todas las condiciones se cumplen, usa `value.name`
					onChange(value.name);
				}

				return (
					<Autocomplete
						className={className}
						open={open}
						onOpen={handleOpen}
						onClose={handleClose}
						value={
							// Mostrar el objeto Data si el valor es un ID
							typeof value === "string"
								? categories.find((cat) => String(cat.id) === value) || value
								: value || null
						}
						isOptionEqualToValue={(option, value) => option.name === value.name}
						onChange={(_event, newValue) => {
							if (newValue === null) {
								onChange(null); // Limpiar el campo
								return;
							}

							if (typeof newValue === "string") {
								if (!hasPermission(permissions)) {
									// Usuario NO tiene permiso → ignoramos la entrada
									return;
								}
							}
							onChange((newValue as Data).id.toString());
						}}
						filterOptions={(opts, params) => {
							const filtered = opts.filter((o) =>
								o.name.toLowerCase().includes(params.inputValue.toLowerCase()),
							);
							return hasPermission(permissions) ? filtered : filtered; // sin permiso no añadimos la opción extra
						}}
						onInputChange={(event, newValue) => {
							if (!hasPermission(permissions)) return;
							onChange(event, newValue);
						}}
						getOptionLabel={(option) =>
							typeof option === "string" ? option : option.name
						}
						options={categories}
						loading={loading}
						freeSolo={hasPermission(permissions)}
						renderInput={(params) => (
							<TextField
								{...params}
								label={label}
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
				);
			}}
		/>
	);
}
