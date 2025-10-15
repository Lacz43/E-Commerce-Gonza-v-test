import { Head } from "@inertiajs/react";
import {
	Assessment,
	CalendarMonth,
	Clear, 
	Inventory as InventoryIcon,
	TrendingUp,
	Update,
	Warning
} from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Divider,
	TextField, 
	Typography
} from "@mui/material";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
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

			<Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
				{/* Header moderno con gradiente */}
				<PageHeader title="Reportes de Inventario" icon={InventoryIcon} subtitle="Reportes de inventario con filtros avanzados"/>

				{/* Filtros Opcionales */}
				<Box sx={{ mt: 4 }}>
					<Card
						sx={{
							mb: 4,
							borderRadius: 3,
							boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							border: "1px solid rgba(0,0,0,0.06)",
							overflow: "visible",
						}}
					>
						<CardHeader
							title={
								<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
									<Box
										sx={{
											p: 1,
											borderRadius: 2,
											bgcolor: "primary.main",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<TrendingUp sx={{ color: "white", fontSize: 24 }} />
									</Box>
									<Typography variant="h5" fontWeight="600">
										Filtros Avanzados
									</Typography>
								</Box>
							}
							action={
								<Button
									variant="outlined"
									startIcon={<Clear />}
									onClick={clearFilters}
									size="small"
									sx={{ borderRadius: 2 }}
								>
									Limpiar
								</Button>
							}
							subheader="Personaliza tus reportes con filtros específicos"
							sx={{ pb: 1 }}
						/>
						<CardContent>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
								{/* Rango de Stock */}
								<Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											mb: 2,
										}}
									>
										<InventoryIcon sx={{ color: "primary.main" }} />
										<Typography variant="h6" fontWeight="600">
											Rango de Stock
										</Typography>
									</Box>
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
										/>
									</Box>
								</Box>

								<Divider />

								{/* Fecha de Creación */}
								<Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											mb: 2,
										}}
									>
										<CalendarMonth sx={{ color: "success.main" }} />
										<Typography variant="h6" fontWeight="600">
											Fecha de Creación
										</Typography>
									</Box>
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
										/>
									</Box>
								</Box>

								<Divider />

								{/* Fecha de Actualización */}
								<Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											mb: 2,
										}}
									>
										<Update sx={{ color: "warning.main" }} />
										<Typography variant="h6" fontWeight="600">
											Fecha de Actualización
										</Typography>
									</Box>
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
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
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 2,
												},
											}}
										/>
									</Box>
								</Box>

								{/* Información de filtros aplicados */}
								<Box
									sx={{
										p: 3,
										bgcolor: "grey.50",
										borderRadius: 2,
										border: "1px dashed",
										borderColor: "grey.300",
									}}
								>
									<Typography variant="subtitle1" fontWeight="600" gutterBottom>
										📋 Filtros Activos
									</Typography>
									{Object.values(filters).some((v) => v) ? (
										<Box
											sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
										>
											{filters.stockMin && (
												<Chip
													label={`Stock min: ${filters.stockMin}`}
													size="small"
													color="primary"
													variant="outlined"
												/>
											)}
											{filters.stockMax && (
												<Chip
													label={`Stock max: ${filters.stockMax}`}
													size="small"
													color="primary"
													variant="outlined"
												/>
											)}
											{filters.createdFrom && (
												<Chip
													label={`Creado desde: ${filters.createdFrom}`}
													size="small"
													color="success"
													variant="outlined"
												/>
											)}
											{filters.createdTo && (
												<Chip
													label={`Creado hasta: ${filters.createdTo}`}
													size="small"
													color="success"
													variant="outlined"
												/>
											)}
											{filters.updatedFrom && (
												<Chip
													label={`Actualizado desde: ${filters.updatedFrom}`}
													size="small"
													color="warning"
													variant="outlined"
												/>
											)}
											{filters.updatedTo && (
												<Chip
													label={`Actualizado hasta: ${filters.updatedTo}`}
													size="small"
													color="warning"
													variant="outlined"
												/>
											)}
										</Box>
									) : (
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{ mt: 1 }}
										>
											No hay filtros aplicados
										</Typography>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Box>

				{/* Reportes Disponibles */}
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
			</Box>
		</AuthenticatedLayout>
	);
}
