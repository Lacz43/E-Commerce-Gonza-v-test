import { History, SwapHoriz, Timeline } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

export default function ReportsButtons() {
	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h5" gutterBottom>
				Reportes Disponibles
			</Typography>
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
				<Button
					variant="contained"
					color="primary"
					startIcon={<History />}
					onClick={() => window.open(route("reports.movements.all"), "_blank")}
				>
					Historial Completo
				</Button>

				<Button
					variant="contained"
					color="success"
					startIcon={<SwapHoriz />}
					onClick={() =>
						window.open(route("reports.movements.in-out"), "_blank")
					}
				>
					Entradas y Salidas
				</Button>
			</Box>
		</Box>
	);
}
