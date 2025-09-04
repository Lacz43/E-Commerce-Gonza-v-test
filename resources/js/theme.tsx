import { createTheme } from "@mui/material/styles";

// Paleta extendida basada en los colores originales (#72c510 verde primario y #f24c04 naranja secundario)
// Añadimos tonos light/dark y colores de feedback para mejor contraste y accesibilidad.
// Los componentes que ya tienen estilos propios (gradient inline, DataGrid headers, etc.) se mantienen
// porque no sobreescribimos variantes contenidas (primary/secondary) más allá de ajustes neutrales.

export const theme = createTheme({
	palette: {
		primary: {
			light: "#8fd23d",
			main: "#72c510",
			dark: "#4a820b",
			contrastText: "#ffffff",
		},
		secondary: {
			light: "#ff7a33",
			main: "#f24c04",
			dark: "#a93500",
			contrastText: "#ffffff",
		},
		success: {
			light: "#A8F4C2",
			main: "#86EFAC",
			dark: "#4CA871",
			contrastText: "#053321",
		},
		warning: {
			light: "#FFE0B9",
			main: "#FDBA74",
			dark: "#E27A1F",
			contrastText: "#4A2B00",
		},
		info: {
			light: "#8BE2D9",
			main: "#3CBEB2",
			dark: "#2A827A",
			contrastText: "#042F2B",
		},
		error: {
			light: "#FFB4A8",
			main: "#E04532",
			dark: "#9A2F24",
			contrastText: "#FFFFFF",
		},
		background: {
			//default: "#F9FAF9",
			paper: "#FFFFFF",
		},
	},
	shape: {
		borderRadius: 10,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 8,
				},
				// Aplicamos el degradado SOLO a botones color="info" contained (no afecta a primary/secondary ya personalizados en el código existente)
				containedInfo: {
					background: "linear-gradient(90deg,#FDBA74,#86EFAC)",
					color: "#0F5132",
					"&:hover": {
						background: "linear-gradient(90deg,#fca860,#6ede93)",
					},
				},
			},
		},
	},
});
