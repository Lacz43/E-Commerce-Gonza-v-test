import { router } from "@inertiajs/react";
import Paper from "@mui/material/Paper";
import {
	DataGrid,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useEffect, useRef, useState } from "react";
import usePermissions from "@/Hook/usePermissions";
import CrudButton from "./CrudButton";

type ActionHandler = {
	permissions?: string[];
	hook: (id: number) => void;
};

export type tableProps<T> = {
	columns: GridColDef[];
	response: paginateResponse<T>;
	onEdit?: ActionHandler;
	onDelete?: ActionHandler;
	onShow?: ActionHandler;
};

export default function DataTable<T>({
	columns,
	response,
	onEdit,
	onShow,
	onDelete,
}: tableProps<T>) {
	const [loading, setLoading] = useState(false);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 20,
	});
	const { hasPermission } = usePermissions();

	const url = new URL(window.location.href);

	useEffect(() => {
		setPaginationModel({
			page: Number(url.searchParams.get("page")) ?? 0,
			pageSize: Number(url.searchParams.get("perPage") ?? 20),
		});
	}, []);

	function removeFiltersFromUrl(url: URL) {
		const parsedUrl = new URL(url);
		const searchParams = parsedUrl.searchParams;

		// Recoge todas las claves en un array para evitar problemas durante la iteración
		const keys = Array.from(searchParams.keys());

		for (const key of keys) {
			if (key.startsWith("filters[")) {
				searchParams.delete(key);
			}
		}

		// Rebuild the URL without filters
		return parsedUrl;
	}

	const buildApiUrl = (filterModel: GridFilterModel) => {
		const url = new URL(window.location.href); // O usa tu base URL

		if (filterModel.items.length === 0) return removeFiltersFromUrl(url);
		// 1. Filtros dinámicos
		filterModel.items.forEach((item, index) => {
			if (!item.value) return;
			const field = item.field;
			const operator = item.operator;
			const value = item.value;

			url.searchParams.append(`filters[${index}][field]`, field);
			url.searchParams.append(`filters[${index}][operator]`, operator);
			url.searchParams.append(`filters[${index}][value]`, value);
		});

		return url;
	};

	const handlePaginationChange = (newModel: GridPaginationModel) => {
		const { page, pageSize } = newModel;

		if (page === paginationModel.page && pageSize === paginationModel.pageSize)
			return;

		setPaginationModel(newModel);

		url.searchParams.set("page", (page + 1).toString());
		url.searchParams.set("perPage", (pageSize ? pageSize : 20).toString());

		setLoading(true);
		router.visit(url, {
			preserveState: true,
			preserveScroll: true,
			onFinish: () => setLoading(false),
		});
	};

	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined); // Para almacenar el timeout

	const handleFilterChange = useCallback((newModel: GridFilterModel) => {
		setLoading(true);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// Establecer un nuevo timeout
		debounceRef.current = setTimeout(() => {
			// Aquí iría la lógica para llamar al backend
			router.visit(buildApiUrl(newModel), {
				preserveState: true,
				preserveScroll: true,
				onFinish: () => setLoading(false),
			});
		}, 500);
	}, []);

	useEffect(() => {
		return () => {
			debounceRef.current && clearTimeout(debounceRef.current);
		};
	}, []);

	const actionColumn: GridColDef = {
		field: "actions",
		type: "actions",
		width: 120,
		headerName: "Acciones",
		renderCell: (params) => (
			<div className="flex">
				{onShow && hasPermission(onShow?.permissions ?? []) && (
					<CrudButton type="show" onClick={() => onShow.hook(params.row.id)} />
				)}
				{onEdit && hasPermission(onEdit?.permissions ?? []) && (
					<CrudButton type="edit" onClick={() => onEdit.hook(params.row.id)} />
				)}
				{onDelete && hasPermission(onDelete?.permissions ?? []) && (
					<CrudButton
						type="delete"
						onClick={() => onDelete.hook(params.row.id)}
					/>
				)}
			</div>
		),
	};

	if (onEdit || onDelete || onShow) {
		columns.push(actionColumn);
	}

	return (
		<Paper sx={{ width: "100%" }}>
			<DataGrid
				rows={response.data}
				columns={columns}
				rowCount={response.total}
				loading={loading}
				onPaginationModelChange={handlePaginationChange}
				paginationModel={paginationModel}
				onFilterModelChange={handleFilterChange}
				localeText={esES.components.MuiDataGrid.defaultProps.localeText}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				filterMode="server"
				sortingMode="client"
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
