import { Business, CalendarMonth, Clear, SwapHoriz } from "@mui/icons-material";
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

interface FiltersProps {
	filters: {
		movementType: string;
		dateFrom: string;
		dateTo: string;
		model: string;
	};
	handleFilterChange: (field: string, value: string) => void;
	clearFilters: () => void;
	modelsName: Record<string, string>;
}

export default function Filters({
	filters,
	handleFilterChange,
	clearFilters,
	modelsName,
}: FiltersProps) {
	const movementTypeId = useId();
	const modelId = useId();

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
								<SwapHoriz sx={{ color: "white", fontSize: 24 }} />
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
						{/* Tipo de Movimiento */}
						<Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mb: 2,
								}}
							>
								<SwapHoriz sx={{ color: "primary.main" }} />
								<Typography variant="h6" fontWeight="600">
									Tipo de Movimiento
								</Typography>
							</Box>
							<FormControl fullWidth size="small">
								<InputLabel id={`${movementTypeId}-label`}>Tipo</InputLabel>
								<Select
									labelId={`${movementTypeId}-label`}
									value={filters.movementType}
									label="Tipo"
									onChange={(e) =>
										handleFilterChange("movementType", e.target.value)
									}
									sx={{
										borderRadius: 2,
									}}
								>
									<MenuItem value="">
										<em>Todos</em>
									</MenuItem>
									<MenuItem value="ingress">Entrada</MenuItem>
									<MenuItem value="egress">Salida</MenuItem>
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

						{/* Modelo */}
						<Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mb: 2,
								}}
							>
								<Business sx={{ color: "warning.main" }} />
								<Typography variant="h6" fontWeight="600">
									Modelo
								</Typography>
							</Box>
							<FormControl fullWidth size="small">
								<InputLabel id={`${modelId}-label`}>Modelo</InputLabel>
								<Select
									labelId={`${modelId}-label`}
									value={filters.model}
									label="Modelo"
									onChange={(e) => handleFilterChange("model", e.target.value)}
									sx={{
										borderRadius: 2,
									}}
								>
									<MenuItem value="">
										<em>Todos</em>
									</MenuItem>
									{Object.entries(modelsName).map(([key, label]) => (
										<MenuItem key={key} value={key}>
											{label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
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
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
									{filters.movementType && (
										<Chip
											label={`Tipo: ${filters.movementType === "entry" ? "Entrada" : "Salida"}`}
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
									{filters.model && (
										<Chip
											label={`Modelo: ${modelsName[filters.model] || filters.model}`}
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
