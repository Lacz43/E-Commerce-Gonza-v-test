import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

type Props = {
	errors: FieldError | undefined;
	register: UseFormRegisterReturn<string>;
	className: string;
};

type Category = { id: number; name: string };

export default function CategoryInput({ errors, register, className }: Props) {
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
		<Autocomplete
			className={className}
			open={open}
			onOpen={handleOpen}
			onClose={handleClose}
			isOptionEqualToValue={(option, value) => option.name === value.name}
			getOptionLabel={(option) => option.name}
			options={categories}
			loading={loading}
			renderInput={(params) => (
				<TextField
					{...params}
					{...register}
					label="Categoria"
                    variant="filled"
                    required
                    error={errors !== undefined}
                    helperText={errors?.message}
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
}
