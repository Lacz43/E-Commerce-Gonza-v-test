import { Head } from "@inertiajs/react";
import { Assessment, Inventory as InventoryIcon, Warning } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Inventory() {
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Reportes de Inventario
				</h2>
			}
		>
			<Head title="Reportes de Inventario" />

			<Box sx={{ p: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Reportes de Inventario
				</Typography>
				<Typography variant="body1" color="textSecondary" gutterBottom>
					Monitorea y analiza el estado de tu inventario
				</Typography>

				{/* Reportes Disponibles */}
				<Box sx={{ mt: 4 }}>
					<Typography variant="h5" gutterBottom>
						Reportes Disponibles
					</Typography>
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<InventoryIcon />}
							onClick={() =>
								window.open(route("reports.inventory.status"), "_blank")
							}
						>
							Estado General de Inventario
						</Button>

						<Button
							variant="contained"
							color="error"
							startIcon={<Warning />}
							onClick={() =>
								window.open(route("reports.inventory.low-stock"), "_blank")
							}
						>
							Productos con Stock Bajo
						</Button>

						<Button
							variant="contained"
							color="info"
							startIcon={<Assessment />}
							onClick={() =>
								window.open(route("reports.inventory.valuation"), "_blank")
							}
						>
							Valoración de Inventario
						</Button>
					</Box>
				</Box>
			</Box>
		</AuthenticatedLayout>
	);
}
