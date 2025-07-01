import { Button } from "@mui/material";

export default function BackButtom() {
	const handleBackClick = () => {
		window.history.back();
	};
	return (
		<Button variant="contained" size="small" onClick={() => handleBackClick()}>
			<b>Atras</b>
		</Button>
	);
}
