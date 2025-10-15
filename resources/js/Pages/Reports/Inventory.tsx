import { Head } from "@inertiajs/react";
import {
	Assessment,
	Clear,
	Inventory as InventoryIcon,
	Warning,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Inventory() {
	const [filters, setFilters] = useState({
		stockMin: "",
		stockMax: "",
		createdFrom: "",
		createdTo: "",
		updatedFrom: "",
		updatedTo: "",
	});

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const clearFilters = () => {
		setFilters({
			stockMin: "",
			stockMax: "",
			createdFrom: "",
			createdTo: "",
			updatedFrom: "",
			updatedTo: "",
		});
	};

	const buildUrlWithFilters = (baseRoute: string) => {
		const params = new URLSearchParams();

		if (filters.stockMin) params.append("stock_min", filters.stockMin);
		if (filters.stockMax) params.append("stock_max", filters.stockMax);
		if (filters.createdFrom) params.append("created_from", filters.createdFrom);
		if (filters.createdTo) params.append("created_to", filters.createdTo);
		if (filters.updatedFrom) params.append("updated_from", filters.updatedFrom);
		if (filters.updatedTo) params.append("updated_to", filters.updatedTo);

		const queryString = params.toString();
		return queryString
			? `${route(baseRoute)}?${queryString}`
			: route(baseRoute);
	};

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

				{/* Filtros Opcionales */}
				<Box sx={{ mt: 3 }}>
					<Card sx={{ mb: 3 }}>
						<CardHeader
							title="Filtros Avanzados"
							subheader="Configura filtros opcionales para los reportes"
						/>
						<CardContent>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
								{/* Rango de Stock */}
								<Box>
									<Typography variant="h6" gutterBottom>
										Rango de Stock
									</Typography>
									<Box sx={{ display: "flex", gap: 2 }}>
										<TextField
											fullWidth
											label="Stock Mínimo"
											type="number"
											size="small"
											value={filters.stockMin}
											onChange={(e) =>
												handleFilterChange("stockMin", e.target.value)
											}
											placeholder="Ej: 0"
										/>
										<TextField
											fullWidth
											label="Stock Máximo"
											type="number"
											size="small"
											value={filters.stockMax}
											onChange={(e) =>
												handleFilterChange("stockMax", e.target.value)
											}
											placeholder="Ej: 100"
										/>
									</Box>
								</Box>

								{/* Fecha de Creación */}
								<Box>
									<Typography variant="h6" gutterBottom>
										Fecha de Creación
									</Typography>
									<Box sx={{ display: "flex", gap: 2 }}>
										<TextField
											fullWidth
											label="Desde"
											type="date"
											size="small"
											value={filters.createdFrom}
											onChange={(e) =>
												handleFilterChange("createdFrom", e.target.value)
											}
											InputLabelProps={{ shrink: true }}
										/>
										<TextField
											fullWidth
											label="Hasta"
											type="date"
											size="small"
											value={filters.createdTo}
											onChange={(e) =>
												handleFilterChange("createdTo", e.target.value)
											}
											InputLabelProps={{ shrink: true }}
										/>
									</Box>
								</Box>

								{/* Fecha de Actualización */}
								<Box>
									<Typography variant="h6" gutterBottom>
										Fecha de Actualización
									</Typography>
									<Box sx={{ display: "flex", gap: 2 }}>
										<TextField
											fullWidth
											label="Desde"
											type="date"
											size="small"
											value={filters.updatedFrom}
											onChange={(e) =>
												handleFilterChange("updatedFrom", e.target.value)
											}
											InputLabelProps={{ shrink: true }}
										/>
										<TextField
											fullWidth
											label="Hasta"
											type="date"
											size="small"
											value={filters.updatedTo}
											onChange={(e) =>
												handleFilterChange("updatedTo", e.target.value)
											}
											InputLabelProps={{ shrink: true }}
										/>
									</Box>
								</Box>

								{/* Información de filtros aplicados */}
								<Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
									<Typography variant="body2" color="textSecondary">
										<strong>Filtros aplicados:</strong>
										{Object.values(filters).some((v) => v) ? (
											<ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
												{filters.stockMin && (
													<li>Stock mínimo: {filters.stockMin}</li>
												)}
												{filters.stockMax && (
													<li>Stock máximo: {filters.stockMax}</li>
												)}
												{filters.createdFrom && (
													<li>Creación desde: {filters.createdFrom}</li>
												)}
												{filters.createdTo && (
													<li>Creación hasta: {filters.createdTo}</li>
												)}
												{filters.updatedFrom && (
													<li>Actualización desde: {filters.updatedFrom}</li>
												)}
												{filters.updatedTo && (
													<li>Actualización hasta: {filters.updatedTo}</li>
												)}
											</ul>
										) : (
											<span style={{ marginLeft: 8 }}>Ninguno</span>
										)}
									</Typography>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Box>

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
								window.open(
									buildUrlWithFilters("reports.inventory.status"),
									"_blank",
								)
							}
						>
							Estado General de Inventario
						</Button>

						<Button
							variant="contained"
							color="error"
							startIcon={<Warning />}
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.inventory.low-stock"),
									"_blank",
								)
							}
						>
							Productos con Stock Bajo
						</Button>

						<Button
							variant="contained"
							color="info"
							startIcon={<Assessment />}
							onClick={() =>
								window.open(
									buildUrlWithFilters("reports.inventory.valuation"),
									"_blank",
								)
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
