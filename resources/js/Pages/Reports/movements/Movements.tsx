import { Head } from "@inertiajs/react";
import { SwapHoriz } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./partials/Filters";
import ReportsButtons from "./partials/ReportsButtons";

export default function Movements() {
	const [filters, setFilters] = useState({
		movementType: "",
		dateFrom: "",
		dateTo: "",
		module: "",
	});

	const handleFilterChange = (field: string, value: string) => {
		setFilters(prev => ({
			...prev,
			[field]: value
		}));
	};

	const clearFilters = () => {
		setFilters({
			movementType: "",
			dateFrom: "",
			dateTo: "",
			module: "",
		});
	};

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Reportes de Movimientos
				</h2>
			}
		>
			<Head title="Reportes de Movimientos" />

			<Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
				<PageHeader
					title="Reportes de Movimientos de Inventario"
					icon={SwapHoriz}
					subtitle="Historial completo de entradas, salidas y ajustes de inventario"
				/>

				<Filters
					filters={filters}
					handleFilterChange={handleFilterChange}
					clearFilters={clearFilters}
				/>

				<ReportsButtons />
			</Box>
		</AuthenticatedLayout>
	);
}
