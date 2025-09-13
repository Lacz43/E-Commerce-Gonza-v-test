import { Button, TextField } from "@mui/material";
import axios from "axios";
import { type FormEvent, useId, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ImageUrlInput() {
	const [error, setError] = useState(false);
	const inputId = useId();
	const { setValue, getValues } = useFormContext();

	const getImage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const url = formData.get("url") as string;
		const elementTarget = event.currentTarget;
		setError(false);
		try {
			const response = await axios.get(url, {
				responseType: "blob",
			});
			const file = new File([response.data], "image-url", {
				type: response.headers["content-type"] || "image/jpeg",
			});
			elementTarget.reset();
			// Agrega la imagen al array 'images' del formulario
			const currentImages = getValues("images") || [];
			setValue("images", [...currentImages, file]);
		} catch (e) {
			console.log(e);
			setError(true);
		}
	};

	return (
		<form onSubmit={getImage} className="mb-3 flex">
			<TextField
				className="w-full"
				error={error}
				name="url"
				id={inputId}
				label="URL de la imagen"
				variant="filled"
				size="small"
				sx={{ "& .MuiFilledInput-root": { borderTopRightRadius: 0 } }}
				helperText={error ? "Error al intentar cargar la imagen" : ""}
			/>
			<Button
				variant="contained"
				type="submit"
				sx={{ borderEndStartRadius: 0, borderTopLeftRadius: 0 }}
			>
				<b>Añadir</b>
			</Button>
		</form>
	);
}
