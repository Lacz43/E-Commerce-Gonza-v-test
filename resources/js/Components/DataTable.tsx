import {
	DataGrid,
	type GridRowsProp,
	type GridColDef,
	type GridValidRowModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { router } from "@inertiajs/react";
import { useState } from "react";

const paginationModel = { page: 1, pageSize: 5 };

export type tableProps = {
	content: GridRowsProp;
	columns: GridColDef[];
	rows: number;
	links: [
		{
			url: string | URL;
			label: string;
			active: boolean;
		},
	];
};

export type TableContent<T extends GridValidRowModel> = T[];

export default function DataTable({
	content,
	columns,
	rows,
	links,
}: tableProps) {
	const [loading, setLoading] = useState(false);

	return (
		<Paper sx={{ width: "100%" }}>
			<DataGrid
				rows={content}
				columns={columns}
				rowCount={rows}
				loading={loading}
				onPaginationModelChange={(model) => {
					setLoading(true);
					router.visit(links[model.page].url, {
						preserveState: true,
						preserveScroll: true,
						onFinish: () => {
							setLoading(false);
						},
					});
				}}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				checkboxSelection
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
