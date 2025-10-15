import { Inventory, TrendingUp, Warning } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type React from "react";

interface MetricsCardsProps {
	totalStock: number;
	lowStockProducts: Array<{ name: string; stock: number }>;
	totalRevenue: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
	totalStock,
	lowStockProducts,
	totalRevenue,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Stock Total Card */}
			<Box
				sx={{
					background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
					borderRadius: 3,
					padding: 3,
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
					border: "1px solid",
					borderColor: "rgba(5, 150, 105, 0.2)",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
						transform: "translateY(-4px)",
					},
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
					<Box
						sx={{
							background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
							borderRadius: 2,
							padding: 1.5,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Inventory sx={{ color: "white", fontSize: 32 }} />
					</Box>
					<Typography variant="h6" fontWeight={600} color="#047857">
						Stock Total
					</Typography>
				</Box>
				<Typography variant="h3" fontWeight={700} color="#059669">
					{totalStock.toLocaleString()}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					Unidades en inventario
				</Typography>
			</Box>

			{/* Bajo Stock Card */}
			<Box
				sx={{
					background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
					borderRadius: 3,
					padding: 3,
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
					border: "1px solid",
					borderColor: "rgba(239, 68, 68, 0.2)",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
						transform: "translateY(-4px)",
					},
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
					<Box
						sx={{
							background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
							borderRadius: 2,
							padding: 1.5,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Warning sx={{ color: "white", fontSize: 32 }} />
					</Box>
					<Typography variant="h6" fontWeight={600} color="#b91c1c">
						Bajo Stock
					</Typography>
				</Box>
				<Typography variant="h3" fontWeight={700} color="#dc2626">
					{lowStockProducts.length}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					Productos con stock bajo
				</Typography>
			</Box>

			{/* Ingresos Card */}
			<Box
				sx={{
					background: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
					borderRadius: 3,
					padding: 3,
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
					border: "1px solid",
					borderColor: "rgba(249, 115, 22, 0.2)",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
						transform: "translateY(-4px)",
					},
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
					<Box
						sx={{
							background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
							borderRadius: 2,
							padding: 1.5,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<TrendingUp sx={{ color: "white", fontSize: 32 }} />
					</Box>
					<Typography variant="h6" fontWeight={600} color="#c2410c">
						Ingresos
					</Typography>
				</Box>
				<Typography variant="h3" fontWeight={700} color="#ea580c">
					$
					{totalRevenue.toLocaleString("es-ES", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					Ingresos totales del período
				</Typography>
			</Box>
		</div>
	);
};

export default MetricsCards;
