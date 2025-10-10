import { router } from "@inertiajs/react";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useMediaQuery, useTheme } from "@mui/material";
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
			<ColumnsPanelTrigger
				render={(props) => (
					<Tooltip title="Columnas">
						<ToolbarButton {...props}>
							<ViewColumnIcon fontSize="small" />
						</ToolbarButton>
					</Tooltip>
				)}
			/>

			<FilterPanelTrigger
				render={(props) => (
					<Tooltip title="Filtros">
						<ToolbarButton {...props}>
							<FilterListIcon fontSize="small" />
						</ToolbarButton>
					</Tooltip>
				)}
			/>

			<TextField
				value={search}
				onChange={(e) => handleSearchChange(e.target.value)}
				placeholder="Buscar..."
				size="small"
				autoComplete="off"
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" />
							</InputAdornment>
						),
						endAdornment: search ? (
							<InputAdornment position="end">
								<CancelIcon
									fontSize="small"
									onClick={() => handleSearchChange("")}
									style={{ cursor: "pointer" }}
								/>
							</InputAdornment>
						) : null,
					},
				}}
				sx={{ ml: 2, minWidth: isMobile ? 150 : 250 }}
			/>
		</Toolbar>
	);
}

export default CustomToolbar;
