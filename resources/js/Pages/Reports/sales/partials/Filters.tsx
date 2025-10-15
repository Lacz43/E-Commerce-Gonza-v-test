import { CalendarMonth, Clear, TrendingUp } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useId } from "react";

interface SalesFiltersProps {
	filters: {
		status: string;
		dateFrom: string;
		dateTo: string;
	};
	handleFilterChange: (field: string, value: string) => void;
	clearFilters: () => void;
}

export default function Filters({
	filters,
	handleFilterChange,
	clearFilters,
}: SalesFiltersProps) {
	const statusId = useId();

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
						{/* Estado */}
						<Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mb: 2,
								}}
							>
								<TrendingUp sx={{ color: "primary.main" }} />
								<Typography variant="h6" fontWeight="600">
									Estado
								</Typography>
							</Box>
							<FormControl fullWidth size="small">
								<InputLabel id={`${statusId}-label`}>Estado</InputLabel>
								<Select
									labelId={`${statusId}-label`}
									value={filters.status}
									label="Estado"
									onChange={(e) =>
										handleFilterChange("status", e.target.value)
									}
									sx={{
										borderRadius: 2,
									}}
								>
									<MenuItem value="">
										<em>Todos</em>
									</MenuItem>
									<MenuItem value="pending">Pendiente</MenuItem>
									<MenuItem value="completed">Completada</MenuItem>
									<MenuItem value="cancelled">Cancelada</MenuItem>
									<MenuItem value="refunded">Reembolsada</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Divider />

						{/* Rango de Fechas */}
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
									Rango de Fechas
								</Typography>
							</Box>
							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									fullWidth
									label="Desde"
									type="date"
									size="small"
									value={filters.dateFrom}
									onChange={(e) =>
										handleFilterChange("dateFrom", e.target.value)
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
									value={filters.dateTo}
									onChange={(e) => handleFilterChange("dateTo", e.target.value)}
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
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
									{filters.status && (
										<Chip
											label={`Estado: ${filters.status === 'pending' ? 'Pendiente' : filters.status === 'completed' ? 'Completada' : filters.status === 'cancelled' ? 'Cancelada' : filters.status === 'refunded' ? 'Reembolsada' : filters.status}`}
											size="small"
											color="primary"
											variant="outlined"
										/>
									)}
									{filters.dateFrom && (
										<Chip
											label={`Desde: ${filters.dateFrom}`}
											size="small"
											color="success"
											variant="outlined"
										/>
									)}
									{filters.dateTo && (
										<Chip
											label={`Hasta: ${filters.dateTo}`}
											size="small"
											color="success"
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
