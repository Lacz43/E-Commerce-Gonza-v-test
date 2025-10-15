import {
	Box,
	Button,
	Card,
	CardContent,
	Typography
} from "@mui/material";
import {
	Assessment,
	Inventory as InventoryIcon,
	Warning
} from "@mui/icons-material";

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
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
					gap: 3,
				}}
			>
				{/* Estado General */}
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
						<Box
							sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
						>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: "primary.main",
									display: "flex",
								}}
							>
								<InventoryIcon sx={{ color: "white", fontSize: 28 }} />
							</Box>
							<Typography variant="h6" fontWeight="600">
								Estado General
							</Typography>
						</Box>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ mb: 3 }}
						>
							Reporte completo del estado actual de todo el inventario
						</Typography>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.inventory.status"),
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

				{/* Stock Bajo */}
				<Card
					sx={{
						borderRadius: 3,
						boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						border: "1px solid",
						borderColor: "error.light",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: "0 8px 24px rgba(244, 67, 54, 0.25)",
						},
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Box
							sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
						>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: "error.main",
									display: "flex",
								}}
							>
								<Warning sx={{ color: "white", fontSize: 28 }} />
							</Box>
							<Typography variant="h6" fontWeight="600">
								Stock Bajo
							</Typography>
						</Box>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ mb: 3 }}
						>
							Productos que requieren reabastecimiento urgente
						</Typography>
						<Button
							fullWidth
							variant="contained"
							color="error"
							size="large"
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.inventory.low-stock"),
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

				{/* Valoración */}
				<Card
					sx={{
						borderRadius: 3,
						boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						border: "1px solid",
						borderColor: "info.light",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: "0 8px 24px rgba(33, 150, 243, 0.25)",
						},
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Box
							sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
						>
							<Box
								sx={{
									p: 1.5,
									borderRadius: 2,
									bgcolor: "info.main",
									display: "flex",
								}}
							>
								<Assessment sx={{ color: "white", fontSize: 28 }} />
							</Box>
							<Typography variant="h6" fontWeight="600">
								Valoración
							</Typography>
						</Box>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ mb: 3 }}
						>
							Análisis financiero y valoración total del inventario
						</Typography>
						<Button
							fullWidth
							variant="contained"
							color="info"
							size="large"
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.inventory.valuation"),
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
