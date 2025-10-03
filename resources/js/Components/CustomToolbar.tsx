import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useMediaQuery, useTheme } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {
	ColumnsPanelTrigger,
	FilterPanelTrigger,
	QuickFilter,
	QuickFilterClear,
	QuickFilterControl,
	QuickFilterTrigger,
	Toolbar,
	ToolbarButton,
} from "@mui/x-data-grid";

type OwnerState = {
	expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
	display: "grid",
	alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
	({ theme, ownerState }) => ({
		gridArea: "1 / 1",
		width: "min-content",
		height: "min-content",
		zIndex: 1,
		opacity: ownerState.expanded ? 0 : 1,
		pointerEvents: ownerState.expanded ? "none" : "auto",
		transition: theme.transitions.create(["opacity"]),
	}),
);

const StyledTextField = styled(TextField)<{
	ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
	gridArea: "1 / 1",
	overflowX: "clip",
	width: ownerState.expanded ? 260 : "var(--trigger-width)",
	opacity: ownerState.expanded ? 1 : 0,
	transition: theme.transitions.create(["width", "opacity"]),
}));

function CustomToolbar() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

			<StyledQuickFilter>
				{isMobile && (
					<QuickFilterTrigger
						render={(triggerProps, state) => (
							<Tooltip title="Buscar" enterDelay={0}>
								<StyledToolbarButton
									{...triggerProps}
									ownerState={{ expanded: state.expanded }}
									color="default"
									aria-disabled={state.expanded}
								>
									<SearchIcon fontSize="small" />
								</StyledToolbarButton>
							</Tooltip>
						)}
					/>
				)}
				<QuickFilterControl
					render={({ ref, ...controlProps }, state) => (
						<StyledTextField
							{...controlProps}
							ownerState={{ expanded: !isMobile || state.expanded }}
							inputRef={ref}
							aria-label="Buscar"
							placeholder="Buscar..."
							size="small"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
									endAdornment: state.value ? (
										<InputAdornment position="end">
											<QuickFilterClear
												edge="end"
												size="small"
												aria-label="Limpiar búsqueda"
											>
												<CancelIcon fontSize="small" />
											</QuickFilterClear>
										</InputAdornment>
									) : null,
									...controlProps.slotProps?.input,
								},
								...controlProps.slotProps,
							}}
						/>
					)}
				/>
			</StyledQuickFilter>
		</Toolbar>
	);
}

export default CustomToolbar;
