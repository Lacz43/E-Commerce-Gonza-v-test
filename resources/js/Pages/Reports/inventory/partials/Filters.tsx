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
import {
	Clear,
	TrendingUp,
	CalendarMonth,
	Update,
	Inventory as InventoryIcon
} from "@mui/icons-material";

interface FiltersProps {
	filters: {
		stockMin: string;
		stockMax: string;
		createdFrom: string;
		createdTo: string;
		updatedFrom: string;
		updatedTo: string;
	};
	handleFilterChange: (field: string, value: string) => void;
	clearFilters: () => void;
}

export default function Filters({ filters, handleFilterChange, clearFilters }: FiltersProps) {
	return (
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
	);
}
