import { Box, Button } from "@mui/material";

type Props = {
	isSubmitting: boolean;
	gradientColors?: {
		from: string;
		to: string;
	};
};

export default function SubmitButton({
	isSubmitting,
	gradientColors = { from: "#667eea", to: "#764ba2" },
}: Props) {
	return (
		<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
			<Button
				type="submit"
				variant="contained"
				disabled={isSubmitting}
				sx={{
					background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.to} 100%)`,
					px: 4,
					py: 1.5,
					borderRadius: 2,
					fontWeight: 700,
					textTransform: "none",
					fontSize: 16,
					"&:hover": {
						opacity: 0.9,
					},
				}}
			>
				{isSubmitting ? "Guardando..." : "Guardar Cambios"}
			</Button>
		</Box>
	);
}
