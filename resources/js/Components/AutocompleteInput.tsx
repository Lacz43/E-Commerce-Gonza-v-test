import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";

type AutocompleteInputProps<T> = {
    title: string;
	options: T[];
};

export default function AutocompleteInput<T>(props: AutocompleteInputProps<T>) {
	const { options, title, ...otherProps } = props;

	const autoComplete = React.useId();

	return (
		<div>
			<Autocomplete
				{...otherProps}
				id={autoComplete}
				options={options}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label={title} />}
			/>
		</div>
	);
}
