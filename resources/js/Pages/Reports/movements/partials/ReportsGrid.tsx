import { History } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface ReportsGridProps {
	buildUrlWithFilters: (baseRoute: string) => string;
}

export default function ReportsGrid({ buildUrlWithFilters }: ReportsGridProps) {
	return (
		<Box sx={{ mt: 5 }}>
			<Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
				📊 Generar Reportes
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
					gap: 3,
				}}
			>
				{/* Historial Completo */}
				<Card
					sx={{
						borderRadius: 3,
						boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						border: "1px solid",
						borderColor: "primary.light",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
						},
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: "primary.main",
									display: "flex",
								}}
							>
								<History sx={{ color: "white", fontSize: 28 }} />
							</Box>
							<Typography variant="h6" fontWeight="600">
								Movimientos
							</Typography>
						</Box>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
							Reporte de los movimientos de inventario
						</Typography>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.movements.all"),
									"_blank",
								)
							}
							sx={{
								borderRadius: 2,
								py: 1.5,
								textTransform: "none",
								fontWeight: 600,
							}}
						>
							Generar Reporte
						</Button>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
}
