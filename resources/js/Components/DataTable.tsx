import { router } from "@inertiajs/react";
import Paper from "@mui/material/Paper";
import {
	DataGrid,
	type GridColDef,
	type GridPaginationModel,
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useEffect, useState } from "react";
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
				localeText={esES.components.MuiDataGrid.defaultProps.localeText}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				sortingMode="client"
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
