import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
	errors: FieldError | undefined;
	register: UseFormRegisterReturn<string>;
};

type Category = { id: number; name: string };

export default function CategoryInput({ errors, register }: Props) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const { data } = await axios.get<Category[]>(
					route("products.categories"),
				);
				setCategories(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		};
		fetchData();
	}, []);

	return (
		<FormControl
			variant="filled"
			className="mt-3 w-full"
			required
			error={errors !== undefined}
			disabled={loading}
		>
			{loading && (
				<CircularProgress
					sx={{ position: "absolute", alignSelf: "anchor-center" }}
					className="right-0 mr-8 "
				/>
			)}
			<InputLabel id="category_product">Categoria</InputLabel>
			<Select
				labelId="category_product"
				id="demo-simple-select-filled"
				defaultValue=""
				{...register}
			>
				<MenuItem value="">None</MenuItem>
				{categories.map((item) => (
					<MenuItem key={item.id} value={item.id}>
						{item.name}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{errors?.message}</FormHelperText>
		</FormControl>
	);
}
