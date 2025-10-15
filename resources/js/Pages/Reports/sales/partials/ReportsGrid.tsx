import {
	Assessment,
	Receipt,
	TrendingUp,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	Typography,
} from "@mui/material";

interface ReportsGridProps {
	buildUrlWithFilters: (baseRoute: string) => string;
}

export default function ReportsGrid({ buildUrlWithFilters }: ReportsGridProps) {
	const reports = [
		{
			id: "orders",
			title: "Órdenes",
			description: "Listado completo de todas las órdenes con detalles",
			icon: Receipt,
			route: "reports.sales.orders",
			color: "error" as const,
			borderColor: "error.light",
			hoverShadow: "0 8px 24px rgba(244, 67, 54, 0.25)",
		},
		{
			id: "analysis",
			title: "Análisis de Ventas",
			description: "Métricas y análisis detallado del rendimiento de ventas",
			icon: Assessment,
			route: "reports.sales.analysis",
			color: "info" as const,
			borderColor: "info.light",
			hoverShadow: "0 8px 24px rgba(33, 150, 243, 0.25)",
		},
		{
			id: "topProducts",
			title: "Top Productos",
			description: "Listado de los productos más vendidos",
			icon: TrendingUp,
			route: "reports.sales.top-products",
			color: "success" as const,
			borderColor: "success.light",
			hoverShadow: "0 8px 24px rgba(76, 175, 80, 0.25)",
		},
	];

	return (
		<Box sx={{ mt: 4 }}>
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
				{reports.map((report) => (
					<Card
						key={report.id}
						sx={{
							borderRadius: 3,
							boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
							transition: "all 0.3s ease",
							cursor: "pointer",
							border: "1px solid",
							borderColor: report.borderColor,
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: report.hoverShadow,
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
										bgcolor: `${report.color}.main`,
										display: "flex",
									}}
								>
									<report.icon sx={{ color: "white", fontSize: 28 }} />
								</Box>
								<Typography variant="h6" fontWeight="600">
									{report.title}
								</Typography>
							</Box>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ mb: 3 }}
							>
								{report.description}
							</Typography>
							<Button
								fullWidth
								variant="contained"
								color={report.color}
								size="large"
								onClick={() =>
									window.open(
										buildUrlWithFilters(report.route),
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
				))}
			</Box>
		</Box>
	);
}
