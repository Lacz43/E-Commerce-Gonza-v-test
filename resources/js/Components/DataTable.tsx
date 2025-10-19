import { router } from "@inertiajs/react";
import Paper from "@mui/material/Paper";
import {
	DataGrid,
	type GridColDef,
	type GridFilterItem,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import qs from "qs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePermissions from "@/Hook/usePermissions";
import { removeParamsFromUrl } from "@/utils";
import CrudButton from "./CrudButton";
import CustomToolbar from "./CustomToolbar";

type ActionHandler = {
	permissions?: string[];
	hook: (id: number) => void;
};

export type tableProps<T> = {
	columns: GridColDef[];
	response: paginateResponse<T>;
	filtersAvailable?: string[] | boolean;
	sortAvailable?: string[] | boolean;
	onEdit?: ActionHandler;
	onDelete?: ActionHandler;
	onShow?: ActionHandler;
	fill?: boolean; // si true, distribuir columnas para ocupar todo el ancho
};

export default function DataTable<T>({
	columns,
	response,
	filtersAvailable,
	sortAvailable,
	onEdit,
	onShow,
	onDelete,
	fill = false,
}: tableProps<T>) {
	const [loading, setLoading] = useState(false);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 20,
	});
	const [filterModel, setFilterModel] = useState<GridFilterModel>();
	const [sortModel, setSortModel] = useState<GridSortModel>();
	const { hasPermission } = usePermissions(); // Usamos la hook de permissions

	// Obtenemos la página actual y el tamaño de página desde la URL
	useEffect(() => {
		const url = new URL(window.location.href);
		setPaginationModel({
			page: Number(url.searchParams.get("page")) ?? 0,
			pageSize: Number(url.searchParams.get("perPage") ?? 20),
		});
		const params = qs.parse(url.search, { ignoreQueryPrefix: true }) as {
			filters?: GridFilterItem[];
		};

		setFilterModel({
			items: params?.filters || [],
		});

		setSortModel([
			{
				field: url.searchParams.get("sort[field]") ?? "",
				sort: url.searchParams.get("sort[order]") as "asc" | "desc" | undefined,
			},
		]);
	}, []);

	// Construye la URL para los filtros dinámicos
	const buildApiFilterUrl = useCallback((filterModel: GridFilterModel) => {
		const url = new URL(window.location.href); // O usa tu base URL

		// borrar filtros viejos
		Array.from(url.searchParams.keys())
			.filter((key) => key.startsWith("filters["))
			.forEach((key) => {
				url.searchParams.delete(key);
			});

		if (filterModel.items.length === 0) return url;
		// 1. Filtros dinámicos
		filterModel.items.forEach((item, index) => {
			if (!item.value) return;
			const value = String(item.value);
			url.searchParams.append(`filters[${index}][field]`, item.field);
			url.searchParams.append(`filters[${index}][operator]`, item.operator);
			url.searchParams.append(`filters[${index}][value]`, value);
		});

		return url;
	}, []);

	// Construye la URL para el ordenamiento
	const buildApiSortUrl = useCallback((sortModel: GridSortModel) => {
		const url = new URL(window.location.href); // O usa tu base URL

		if (sortModel.length === 0) return removeParamsFromUrl(url, "sort[");
		const { field, sort } = sortModel[0];
		if (!sort) return url;

		url.searchParams.set("sort[field]", field);
		url.searchParams.set("sort[order]", sort);
		return url;
	}, []);

	// Cambia la página actual
	const handlePaginationChange = useCallback(
		(newModel: GridPaginationModel) => {
			const { page, pageSize } = newModel;

			if (
				page === paginationModel.page &&
				pageSize === paginationModel.pageSize
			)
				return;

			setPaginationModel(newModel);

			const url = new URL(window.location.href);
			url.searchParams.set("page", (page + 1).toString());
			url.searchParams.set("perPage", (pageSize ? pageSize : 20).toString());

			setLoading(true);
			router.visit(url, {
				preserveState: true,
				preserveScroll: true,
				onFinish: () => setLoading(false),
			});
		},
		[paginationModel],
	);

	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined); // Para almacenar el timeout

	// Filtro dinámico
	const handleFilterChange = useCallback(
		(newModel: GridFilterModel) => {
			setLoading(true);
			setFilterModel(newModel);

			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			// Establecer un nuevo timeout
			debounceRef.current = setTimeout(() => {
				// Aquí iría la lógica para llamar al backend
				router.visit(buildApiFilterUrl(newModel), {
					preserveState: true,
					preserveScroll: true,
					onFinish: () => setLoading(false),
				});
			}, 500);
		},
		[buildApiFilterUrl],
	);

	// Ordenamiento
	const handleSortChange = (newModel: GridSortModel) => {
		setLoading(true);
		setSortModel(newModel);
		router.visit(buildApiSortUrl(newModel), {
			preserveState: true,
			preserveScroll: true,
			onFinish: () => setLoading(false),
		});
	};

	// Eliminamos el timeout cuando cambiamos la página
	useEffect(
		() => () => {
			debounceRef.current && clearTimeout(debounceRef.current);
		},
		[],
	);

	const processedColumns = useMemo(() => {
		let cols = [...columns];

		if (filtersAvailable !== undefined) {
			cols = cols.map((col) => ({
				...col,
				filterable:
					typeof filtersAvailable === "boolean"
						? filtersAvailable
						: filtersAvailable?.includes(col.field) || false,
			}));
		}

		if (sortAvailable !== undefined) {
			cols = cols.map((col) => ({
				...col,
				sortable:
					typeof sortAvailable === "boolean"
						? sortAvailable
						: sortAvailable?.includes(col.field) || false,
			}));
		}

		const actionColumn: GridColDef = {
			field: "actions",
			type: "actions",
			width: 120,
			headerName: "Acciones",
			renderCell: (params) => (
				<div className="flex">
					{onShow?.hook && (onShow.permissions?.length === 0 || hasPermission(onShow.permissions ?? [])) && (
						<CrudButton
							type="show"
							onClick={() => onShow.hook(params.row.id)}
						/>
					)}
					{onEdit?.hook && (onEdit.permissions?.length === 0 || hasPermission(onEdit.permissions ?? [])) && (
						<CrudButton
							type="edit"
							onClick={() => onEdit.hook(params.row.id)}
						/>
					)}
					{onDelete?.hook && (onDelete.permissions?.length === 0 || hasPermission(onDelete.permissions ?? [])) && (
						<CrudButton
							type="delete"
							onClick={() => onDelete.hook(params.row.id)}
						/>
					)}
				</div>
			),
		};

		if (onEdit || onDelete || onShow) {
			cols.push(actionColumn);
		}

		// Ajustar columnas para llenar el espacio horizontal si fill está activo
		if (fill) {
			const totalExplicitFlex = cols.reduce(
				(acc, c) => acc + (typeof c.flex === "number" ? c.flex : 0),
				0,
			);
			const needsFlex = cols.filter(
				(c) =>
					c.field !== "actions" &&
					c.width === undefined && // si ya tiene width lo dejamos intacto
					(c.flex === undefined || c.flex === 0),
			);
			// Si no hay flex definido en ninguna columna, asignar flex=1 solo a las que no tienen width
			if (needsFlex.length && totalExplicitFlex === 0) {
				cols = cols.map((c) => {
					if (c.field === "actions" || c.field === "id") return c; // mantener ancho fijo
					if (c.width !== undefined) return c; // respetar ancho fijo explícito
					if (c.flex === undefined || c.flex === 0) {
						return { ...c, flex: 1, minWidth: c.minWidth ?? 110 };
					}
					return c;
				});
			}
		}

		return cols;
	}, [
		columns,
		filtersAvailable,
		sortAvailable,
		onEdit,
		onDelete,
		onShow,
		hasPermission,
		fill,
	]);

	return (
		<Paper 
			elevation={0}
			sx={{ 
				width: "100%",
				borderRadius: 3,
				overflow: "hidden",
				border: "1px solid",
				borderColor: "rgba(5, 150, 105, 0.15)",
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
			}}
		>
			<DataGrid
				rows={response.data}
				columns={processedColumns}
				rowCount={response.total}
				loading={loading}
				onPaginationModelChange={handlePaginationChange}
				paginationModel={paginationModel}
				filterModel={filterModel}
				sortModel={sortModel}
				onFilterModelChange={handleFilterChange}
				onSortModelChange={handleSortChange}
				localeText={esES.components.MuiDataGrid.defaultProps.localeText}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				filterMode="server"
				sortingMode="server"
				slots={{ toolbar: CustomToolbar }}
				showToolbar
				sx={{
					border: 0,
					// Toolbar moderno
					"& .MuiDataGrid-toolbarContainer": {
						background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
						padding: "16px",
						borderBottom: "2px solid rgba(5, 150, 105, 0.2)",
					},
					// Headers con gradiente emerald
					"& .MuiDataGrid-columnHeaders": {
						background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
						color: "#ffffff",
						fontWeight: 600,
						borderBottom: "none",
					},
					"& .MuiDataGrid-columnHeader": {
						background: "inherit",
						"&:focus": {
							outline: "none",
						},
						"&:focus-within": {
							outline: "none",
						},
					},
					"& .MuiDataGrid-columnHeaderTitle": {
						fontWeight: 600,
						color: "#ffffff",
					},
					// Separadores de columnas
					"& .MuiDataGrid-columnSeparator": {
						color: "rgba(255, 255, 255, 0.3)",
					},
					// Iconos en headers
					"& .MuiDataGrid-iconButtonContainer": {
						"& .MuiIconButton-root": {
							color: "#ffffff",
						},
					},
					"& .MuiDataGrid-menuIcon": {
						color: "#ffffff",
					},
					"& .MuiDataGrid-sortIcon": {
						color: "#ffffff",
					},
					// Filas con hover mejorado
					"& .MuiDataGrid-row": {
						transition: "all 0.2s ease",
						"&:hover": {
							backgroundColor: "rgba(5, 150, 105, 0.05)",
							cursor: "pointer",
						},
						"&.Mui-selected": {
							backgroundColor: "rgba(5, 150, 105, 0.1)",
							"&:hover": {
								backgroundColor: "rgba(5, 150, 105, 0.15)",
							},
						},
					},
					// Celdas
					"& .MuiDataGrid-cell": {
						borderBottom: "1px solid rgba(5, 150, 105, 0.08)",
						"&:focus": {
							outline: "2px solid rgba(5, 150, 105, 0.3)",
							outlineOffset: "-2px",
						},
					},
					// Footer con paginación
					"& .MuiDataGrid-footerContainer": {
						background: "linear-gradient(135deg, #f9fafb 0%, #ecfdf5 100%)",
						borderTop: "2px solid rgba(5, 150, 105, 0.2)",
						padding: "8px 16px",
					},
					// Botones de paginación
					"& .MuiTablePagination-root": {
						color: "#047857",
					},
					"& .MuiIconButton-root": {
						color: "#10b981",
						"&:hover": {
							backgroundColor: "rgba(5, 150, 105, 0.1)",
						},
						"&.Mui-disabled": {
							color: "rgba(5, 150, 105, 0.3)",
						},
					},
					// Loading overlay
					"& .MuiDataGrid-overlay": {
						backgroundColor: "rgba(255, 255, 255, 0.9)",
					},
					// Scrollbar personalizado
					"& .MuiDataGrid-virtualScroller": {
						"&::-webkit-scrollbar": {
							width: "8px",
							height: "8px",
						},
						"&::-webkit-scrollbar-track": {
							background: "#f1f1f1",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#10b981",
							borderRadius: "4px",
							"&:hover": {
								background: "#059669",
							},
						},
					},
				}}
			/>
		</Paper>
	);
}
