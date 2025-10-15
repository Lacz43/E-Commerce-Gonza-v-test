import { createTheme } from "@mui/material/styles";

/**
 * Tema moderno para GonzaGo
 * Paleta principal: Emerald (verde moderno) y Orange (naranja vibrante)
 * Diseño: Material Design 3 con toques personalizados
 * Accesibilidad: Contraste WCAG AA compliant
 */

export const theme = createTheme({
	palette: {
		// Color primario: Emerald (verde moderno y profesional)
		primary: {
			light: "#6ee7b7", // emerald-300
			main: "#10b981", // emerald-500
			dark: "#047857", // emerald-700
			contrastText: "#ffffff",
		},
		// Color secundario: Orange (naranja vibrante para acentos)
		secondary: {
			light: "#fdba74", // orange-300
			main: "#f97316", // orange-500
			dark: "#c2410c", // orange-700
			contrastText: "#ffffff",
		},
		// Estados de feedback mejorados
		success: {
			light: "#86efac", // green-300
			main: "#22c55e", // green-500
			dark: "#15803d", // green-700
			contrastText: "#ffffff",
		},
		warning: {
			light: "#fcd34d", // yellow-300
			main: "#f59e0b", // yellow-500
			dark: "#d97706", // yellow-600
			contrastText: "#ffffff",
		},
		info: {
			light: "#7dd3fc", // sky-300
			main: "#0ea5e9", // sky-500
			dark: "#0369a1", // sky-700
			contrastText: "#ffffff",
		},
		error: {
			light: "#fca5a5", // red-300
			main: "#ef4444", // red-500
			dark: "#b91c1c", // red-700
			contrastText: "#ffffff",
		},
		// Backgrounds modernos
		background: {
			default: "#f9fafb", // gray-50
			paper: "#ffffff",
		},
		// Colores de texto mejorados
		text: {
			primary: "#111827", // gray-900
			secondary: "#6b7280", // gray-500
			disabled: "#9ca3af", // gray-400
		},
		// Divisores sutiles
		divider: "rgba(5, 150, 105, 0.12)", // emerald con transparencia
	},
	// Tipografía moderna y legible
	typography: {
		fontFamily: [
			'"Inter"',
			'"Segoe UI"',
			'"Roboto"',
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: {
			fontWeight: 700,
			letterSpacing: "-0.02em",
		},
		h2: {
			fontWeight: 700,
			letterSpacing: "-0.01em",
		},
		h3: {
			fontWeight: 600,
			letterSpacing: "-0.01em",
		},
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 600,
		},
		h6: {
			fontWeight: 600,
		},
		button: {
			fontWeight: 600,
			letterSpacing: "0.02em",
		},
	},
	// Formas redondeadas modernas
	shape: {
		borderRadius: 12,
	},
	// Sombras suaves y modernas
	shadows: [
		"none",
		"0 1px 2px 0 rgba(0, 0, 0, 0.05)",
		"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
		"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
		"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
		"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
	],
	// Componentes personalizados
	components: {
		// Botones modernos
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 10,
					padding: "10px 20px",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					boxShadow: "none",
					"&:hover": {
						boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
						transform: "translateY(-2px)",
					},
					"&:active": {
						transform: "translateY(0)",
					},
				},
				containedPrimary: {
					background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
					"&:hover": {
						background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
					},
				},
				containedSecondary: {
					background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
					"&:hover": {
						background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
					},
				},
			},
		},
		// Cards con mejor elevación
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
					},
				},
			},
		},
		// Inputs modernos
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 10,
						transition: "all 0.3s ease",
						"&:hover": {
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "#10b981",
							},
						},
						"&.Mui-focused": {
							"& .MuiOutlinedInput-notchedOutline": {
								borderWidth: 2,
								borderColor: "#10b981",
							},
						},
					},
				},
			},
		},
		// Chips modernos
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 500,
				},
			},
		},
		// Paper con mejor sombra
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
				rounded: {
					borderRadius: 12,
				},
			},
		},
		// Dialogs modernos
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 16,
					boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				},
			},
		},
	},
});

// Exportar colores para uso directo en componentes
export const colors = {
	emerald: {
		50: "#ecfdf5",
		100: "#d1fae5",
		200: "#a7f3d0",
		300: "#6ee7b7",
		400: "#34d399",
		500: "#10b981",
		600: "#059669",
		700: "#047857",
		800: "#065f46",
		900: "#064e3b",
	},
	orange: {
		50: "#fff7ed",
		100: "#ffedd5",
		200: "#fed7aa",
		300: "#fdba74",
		400: "#fb923c",
		500: "#f97316",
		600: "#ea580c",
		700: "#c2410c",
		800: "#9a3412",
		900: "#7c2d12",
	},
};
