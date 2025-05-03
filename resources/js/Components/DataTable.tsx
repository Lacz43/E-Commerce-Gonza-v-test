import { DataGrid, type GridRowsProp, type GridColDef, type GridValidRowModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 5 };

export type tableProps = {
	content: GridRowsProp;
	columns: GridColDef[];
};

export type TableContent<T extends GridValidRowModel> = T[];

export default function DataTable({ content, columns }: tableProps) {
	return (
		<Paper sx={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={content}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 20]}
				paginationMode="server"
				checkboxSelection
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
