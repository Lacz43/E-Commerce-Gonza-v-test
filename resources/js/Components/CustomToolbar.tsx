import { router } from "@inertiajs/react";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {
	ColumnsPanelTrigger,
	FilterPanelTrigger,
	Toolbar,
	ToolbarButton,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";

function CustomToolbar() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [search, setSearch] = useState("");
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const url = new URL(window.location.href);
		const currentSearch = url.searchParams.get("search") || "";
		setSearch(currentSearch);
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value);

		// Clear existing timeout
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// Set new timeout for debounced search
		debounceRef.current = setTimeout(() => {
			const url = new URL(window.location.href);
			if (value) {
				url.searchParams.set("search", value);
			} else {
				url.searchParams.delete("search");
			}
			router.visit(url, {
				preserveState: true,
				preserveScroll: true,
				replace: true,
			});
		}, 500); // 500ms debounce delay
	}, []);

	return (
		<Toolbar>
			<Box
				sx={{
					display: "flex",
					gap: 1.5,
					alignItems: "center",
					flexWrap: "wrap",
					width: "100%",
					padding: "0 1rem",
				}}
			>
				{/* Botón de Columnas */}
				<ColumnsPanelTrigger
					render={(props) => (
						<Tooltip title="Gestionar Columnas" arrow>
							<Box
								sx={{
									"& button": {
										backgroundColor: "rgba(5, 150, 105, 0.1)",
										color: "#047857",
										borderRadius: 2,
										padding: "8px 12px",
										transition: "all 0.3s ease",
										"&:hover": {
											backgroundColor: "rgba(5, 150, 105, 0.2)",
											transform: "translateY(-2px)",
											boxShadow: "0 4px 8px rgba(5, 150, 105, 0.2)",
										},
									},
								}}
							>
								<ToolbarButton {...props}>
									<ViewColumnIcon fontSize="small" />
								</ToolbarButton>
							</Box>
						</Tooltip>
					)}
				/>

				{/* Botón de Filtros */}
				<FilterPanelTrigger
					render={(props) => (
						<Tooltip title="Aplicar Filtros" arrow>
							<Box
								sx={{
									"& button": {
										backgroundColor: "rgba(5, 150, 105, 0.1)",
										color: "#047857",
										borderRadius: 2,
										padding: "8px 12px",
										transition: "all 0.3s ease",
										"&:hover": {
											backgroundColor: "rgba(5, 150, 105, 0.2)",
											transform: "translateY(-2px)",
											boxShadow: "0 4px 8px rgba(5, 150, 105, 0.2)",
										},
									},
								}}
							>
								<ToolbarButton {...props}>
									<FilterListIcon fontSize="small" />
								</ToolbarButton>
							</Box>
						</Tooltip>
					)}
				/>

				{/* Campo de Búsqueda Mejorado */}
				<TextField
				value={search}
				onChange={(e) => handleSearchChange(e.target.value)}
				placeholder="Buscar en la tabla..."
				size="small"
				autoComplete="off"
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon 
									fontSize="small" 
									sx={{ color: "#10b981" }}
								/>
							</InputAdornment>
						),
						endAdornment: search ? (
							<InputAdornment position="end">
								<Tooltip title="Limpiar búsqueda" arrow>
									<IconButton
										size="small"
										onClick={() => handleSearchChange("")}
										sx={{
											color: "#ef4444",
											"&:hover": {
												backgroundColor: "rgba(239, 68, 68, 0.1)",
											},
										}}
									>
										<CancelIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						) : null,
					},
				}}
				sx={{
					ml: "auto",
					minWidth: isMobile ? 180 : 300,
					"& .MuiOutlinedInput-root": {
						backgroundColor: "white",
						borderRadius: 2,
						transition: "all 0.3s ease",
						"& fieldset": {
							borderColor: "rgba(5, 150, 105, 0.3)",
						},
						"&:hover fieldset": {
							borderColor: "#10b981",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#10b981",
							borderWidth: 2,
						},
						"&.Mui-focused": {
							boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)",
						},
					},
					"& .MuiInputBase-input": {
						color: "#111827",
						"&::placeholder": {
							color: "#9ca3af",
							opacity: 1,
						},
					},
					}}
				/>
			</Box>
		</Toolbar>
	);
}

export default CustomToolbar;
