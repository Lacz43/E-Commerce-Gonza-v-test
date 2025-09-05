import { CircularProgress } from "@mui/material";
import Autocomplete, {
	type AutocompleteProps,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";

export type AutocompleteInputProps<T> = Omit<
	AutocompleteProps<T, false, false, false>,
	"renderInput" | "options"
> & {
	title: string;
	options: T[];
	helperText?: string | React.ReactNode;
	error?: boolean;
	loading?: boolean;
	onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AutocompleteInput<T>(props: AutocompleteInputProps<T>) {
	const {
		options,
		title,
		loading = false,
		onInput,
		helperText,
		error,
		...otherProps
	} = props;

	const autoComplete = React.useId();

	return (
		<div>
			<Autocomplete
				{...otherProps}
				id={autoComplete}
				onInput={onInput}
				options={options}
				loading={loading}
				sx={{ width: 300 }}
				renderInput={(params) => (
					<TextField
						{...params}
						label={title}
						helperText={helperText}
						error={error}
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<React.Fragment>
										{loading ? (
											<CircularProgress color="inherit" size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</React.Fragment>
								),
							},
						}}
					/>
				)}
			/>
		</div>
	);
}
