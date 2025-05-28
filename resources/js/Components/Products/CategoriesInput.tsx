import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from "@mui/material";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
	errors: FieldError | undefined;
	register: UseFormRegisterReturn<string>;
};

export default function CategoryInput({ errors, register }: Props) {
	return (
		<FormControl
			variant="filled"
			className="mt-3 w-full"
			required
			error={errors !== undefined}
		>
			<InputLabel id="category_product">Categoria</InputLabel>
			<Select
				labelId="category_product"
				id="demo-simple-select-filled"
				defaultValue=""
				{...register}
			>
				<MenuItem value="">None</MenuItem>
				<MenuItem value={10}>Ten</MenuItem>
				<MenuItem value={20}>Twenty</MenuItem>
				<MenuItem value={30}>Thirty</MenuItem>
			</Select>
			<FormHelperText>{errors?.message}</FormHelperText>
		</FormControl>
	);
}
