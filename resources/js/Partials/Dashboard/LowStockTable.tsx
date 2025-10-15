import type React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Warning } from "@mui/icons-material";

interface LowStockTableProps {
	lowStockProducts: Array<{ name: string; stock: number }>;
}

const LowStockTable: React.FC<LowStockTableProps> = ({ lowStockProducts }) => {
	return (
		<Box
			sx={{
				background: "white",
				borderRadius: 3,
				padding: 3,
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
				border: "1px solid",
				borderColor: "rgba(239, 68, 68, 0.15)",
				transition: "all 0.3s ease",
				"&:hover": {
					boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
				},
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<Box
					sx={{
						background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
						borderRadius: 2,
						padding: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Warning sx={{ color: "white", fontSize: 24 }} />
				</Box>
				<Typography variant="h6" fontWeight={600} color="text.primary">
					Productos con Stock Bajo
				</Typography>
			</Box>
			{lowStockProducts.length === 0 ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
					No hay productos con stock bajo.
				</Typography>
			) : (
				<Box sx={{ overflowX: "auto" }}>
					{lowStockProducts.map((product, index) => (
						<Box
							key={product.name}
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 2,
								py: 2,
								px: 1,
								borderBottom: index < lowStockProducts.length - 1 ? "1px solid" : "none",
								borderColor: "rgba(239, 68, 68, 0.1)",
								transition: "all 0.2s ease",
								"&:hover": {
									backgroundColor: "rgba(239, 68, 68, 0.05)",
									borderRadius: 2,
								},
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										background: "#ef4444",
										animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
										"@keyframes pulse": {
											"0%, 100%": {
												opacity: 1,
											},
											"50%": {
												opacity: 0.5,
											},
										},
									}}
								/>
								<Box>
									<Typography variant="body1" fontWeight={600} color="text.primary">
										{product.name}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Requiere reabastecimiento
									</Typography>
								</Box>
							</Box>
							<Chip
								label={`${product.stock} unidades`}
								color="error"
								size="small"
								sx={{
									fontWeight: 700,
									minWidth: 90,
								}}
							/>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}

export default LowStockTable;
