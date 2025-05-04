import {
	DataGrid,
	type GridPaginationModel,
	type GridColDef,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export type tableProps<T> = {
	columns: GridColDef[];
	response: paginateResponse<T>;
};

export default function DataTable<T>({ columns, response }: tableProps<T>) {
	const [loading, setLoading] = useState(false);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 20,
	});

	const url = new URL(window.location.href);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

	return (
		<Paper sx={{ width: "100%" }}>
			<DataGrid
				rows={response.data}
				columns={columns}
				rowCount={response.total}
				loading={loading}
				onPaginationModelChange={handlePaginationChange}
				paginationModel={paginationModel}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				sortingMode="client"
				checkboxSelection
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
