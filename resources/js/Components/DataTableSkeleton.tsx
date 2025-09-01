import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { JSX } from "react";

// Crear ids pseudo-estables por render (no indices directos)
const makeIds = (n: number, prefix: string) =>
	Array.from(
		{ length: n },
		(_, i) => `${prefix}-${i}-${Math.random().toString(36).slice(2, 8)}`,
	);

type DataTableSkeletonProps = {
	columns?: number; // número de columnas a simular
	rows?: number; // número de filas skeleton
	showToolbar?: boolean; // mostrar barra superior simulada
	dense?: boolean; // tamaño compacto
};

export default function DataTableSkeleton({
	columns = 6,
	rows = 10,
	showToolbar = true,
	dense = false,
}: DataTableSkeletonProps): JSX.Element {
	const colArray = makeIds(columns, "col");
	const rowArray = makeIds(rows, "row");
	const cellHeight = dense ? 34 : 46;

	return (
		<Paper
			elevation={0}
			sx={{
				width: "100%",
				borderRadius: 3,
				overflow: "hidden",
				border: "1px solid #E2F5EA",
			}}
		>
			{showToolbar && (
				<Box
					sx={{
						px: 2.5,
						py: 1.5,
						display: "flex",
						alignItems: "center",
						gap: 2,
						background: "linear-gradient(90deg,#E6F7EE 0%, #F1FBF4 100%)",
						borderBottom: "1px solid #CDEEDF",
					}}
				>
					<Skeleton
						variant="rounded"
						height={36}
						width={180}
						sx={{ bgcolor: "rgba(134,239,172,.35)" }}
					/>
					<Skeleton
						variant="rounded"
						height={36}
						width={120}
						sx={{ bgcolor: "rgba(134,239,172,.25)" }}
					/>
					<Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
						<Skeleton
							variant="circular"
							width={36}
							height={36}
							sx={{ bgcolor: "rgba(134,239,172,.25)" }}
						/>
						<Skeleton
							variant="circular"
							width={36}
							height={36}
							sx={{ bgcolor: "rgba(134,239,172,.25)" }}
						/>
					</Box>
				</Box>
			)}
			<TableContainer>
				<Table
					size={dense ? "small" : "medium"}
					aria-label="loading table skeleton"
				>
					<TableHead>
						<TableRow sx={{ backgroundColor: "#E6F7EE" }}>
							{colArray.map((colId) => (
								<TableCell
									key={colId}
									sx={{ borderBottom: "1px solid #CDEEDF" }}
								>
									<Skeleton
										variant="text"
										width={`${Math.round(40 + Math.random() * 60)}%`}
										height={20}
										sx={{ bgcolor: "rgba(134,239,172,.55)" }}
									/>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rowArray.map((rowId) => (
							<TableRow key={rowId} hover>
								{colArray.map((colId) => (
									<TableCell
										key={`${rowId}-${colId}`}
										sx={{ py: 0.4, height: cellHeight }}
									>
										<Stack direction="row" alignItems="center" spacing={1.2}>
											<Skeleton
												variant="rounded"
												width={`${Math.round(30 + Math.random() * 50)}%`}
												height={16}
												sx={{ bgcolor: "rgba(134,239,172,.25)" }}
											/>
										</Stack>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box
				sx={{
					px: 2.5,
					py: 1.5,
					borderTop: "1px solid #E3F3EA",
					display: "flex",
					alignItems: "center",
					gap: 2,
				}}
			>
				<Skeleton
					variant="text"
					width={140}
					height={20}
					sx={{ bgcolor: "rgba(134,239,172,.3)" }}
				/>
				<Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
					<Skeleton
						variant="rounded"
						width={80}
						height={32}
						sx={{ bgcolor: "rgba(134,239,172,.25)" }}
					/>
					<Skeleton
						variant="rounded"
						width={80}
						height={32}
						sx={{ bgcolor: "rgba(134,239,172,.25)" }}
					/>
				</Box>
			</Box>
		</Paper>
	);
}
