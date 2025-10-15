import { Head } from "@inertiajs/react";
import {
	Category,
	Inventory,
	Receipt,
	ShoppingCart,
} from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type Props = {
	data: {
		totalProducts: number;
		totalMovements: number;
		totalOrders: number;
		totalUsers: number;
	};
};

export default function Index({ data }: Props) {
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Dashboard de Reportes
				</h2>
			}
		>
			<Head title="Reportes" />

			<Box sx={{ p: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Reportes del Sistema
				</Typography>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Total Productos */}
					<div>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											color="textSecondary"
											gutterBottom
											variant="body2"
										>
											Total Productos
										</Typography>
										<Typography variant="h4" component="div">
											{data.totalProducts}
										</Typography>
									</Box>
									<Category
										sx={{
											fontSize: 40,
											color: "primary.main",
											opacity: 0.7,
										}}
									/>
								</Box>
							</CardContent>
						</Card>
					</div>

					{/* Total Movimientos */}
					<div>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											color="textSecondary"
											gutterBottom
											variant="body2"
										>
											Movimientos Totales
										</Typography>
										<Typography variant="h4" component="div">
											{data.totalMovements}
										</Typography>
									</Box>
									<Inventory
										sx={{
											fontSize: 40,
											color: "secondary.main",
											opacity: 0.7,
										}}
									/>
								</Box>
							</CardContent>
						</Card>
					</div>

					{/* Total Órdenes */}
					<div>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											color="textSecondary"
											gutterBottom
											variant="body2"
										>
											Total Órdenes
										</Typography>
										<Typography variant="h4" component="div">
											{data.totalOrders}
										</Typography>
									</Box>
									<Receipt
										sx={{
											fontSize: 40,
											color: "success.main",
											opacity: 0.7,
										}}
									/>
								</Box>
							</CardContent>
						</Card>
					</div>

					{/* Total Usuarios */}
					<div>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											color="textSecondary"
											gutterBottom
											variant="body2"
										>
											Total Usuarios
										</Typography>
										<Typography variant="h4" component="div">
											{data.totalUsers}
										</Typography>
									</Box>
									<ShoppingCart
										sx={{
											fontSize: 40,
											color: "warning.main",
											opacity: 0.7,
										}}
									/>
								</Box>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Próximas funcionalidades */}
				<Box sx={{ mt: 4 }}>
					<Typography variant="h5" gutterBottom>
						Próximas Funcionalidades
					</Typography>
					<Typography variant="body1" color="textSecondary">
						• Gráficos de ventas por período
						<br />• Reportes de inventario
						<br />• Análisis de productos más vendidos
						<br />• Métricas de rendimiento del sistema
					</Typography>
				</Box>
			</Box>
		</AuthenticatedLayout>
	);
}
