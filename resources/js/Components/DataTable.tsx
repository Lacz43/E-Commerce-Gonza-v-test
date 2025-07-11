import { router } from "@inertiajs/react";
import Paper from "@mui/material/Paper";
import {
	DataGrid,
	type GridFilterItem,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePermissions from "@/Hook/usePermissions";
import { removeParamsFromUrl } from "@/utils";
import CrudButton from "./CrudButton";
import qs from "qs";

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
};

export default function DataTable<T>({
	columns,
	response,
	filtersAvailable,
	sortAvailable,
	onEdit,
	onShow,
	onDelete,
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
			.forEach((key) => url.searchParams.delete(key));

		if (filterModel.items.length === 0) return url;
		// 1. Filtros dinámicos
		filterModel.items.forEach((item, index) => {
			if (!item.value) return;

			url.searchParams.append(`filters[${index}][field]`, item.field);
			url.searchParams.append(`filters[${index}][operator]`, item.operator);
			url.searchParams.append(`filters[${index}][value]`, item.value!);
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
	const handleFilterChange = useCallback((newModel: GridFilterModel) => {
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
	}, []);

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
					{onShow?.hook && hasPermission(onShow.permissions ?? []) && (
						<CrudButton
							type="show"
							onClick={() => onShow.hook(params.row.id)}
						/>
					)}
					{onEdit?.hook && hasPermission(onEdit.permissions ?? []) && (
						<CrudButton
							type="edit"
							onClick={() => onEdit.hook(params.row.id)}
						/>
					)}
					{onDelete?.hook && hasPermission(onDelete.permissions ?? []) && (
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

		return cols;
	}, [
		columns,
		filtersAvailable,
		sortAvailable,
		onEdit,
		onDelete,
		onShow,
		hasPermission,
	]);

	return (
		<Paper sx={{ width: "100%" }}>
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
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
