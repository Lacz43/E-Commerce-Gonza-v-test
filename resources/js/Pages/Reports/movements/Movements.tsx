import { Head } from "@inertiajs/react";
import { SwapHoriz } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./partials/Filters";
import ReportsGrid from "./partials/ReportsGrid";

export default function Movements({
	modelsName,
}: {
	modelsName: Record<string, string>;
}) {
	const [filters, setFilters] = useState({
		movementType: "",
		dateFrom: "",
		dateTo: "",
		model: "",
	});

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const clearFilters = () => {
		setFilters({
			movementType: "",
			dateFrom: "",
			dateTo: "",
			model: "",
		});
	};

	const buildUrlWithFilters = (baseRoute: string) => {
		const params = new URLSearchParams();

		if (filters.movementType)
			params.append("movement_type", filters.movementType);
		if (filters.dateFrom) params.append("date_from", filters.dateFrom);
		if (filters.dateTo) params.append("date_to", filters.dateTo);
		if (filters.model) params.append("model", filters.model);

		const queryString = params.toString();
		return queryString
			? `${route(baseRoute)}?${queryString}`
			: route(baseRoute);
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
					gradientColor="#f59e0b"
				/>

				<Filters
					filters={filters}
					handleFilterChange={handleFilterChange}
					clearFilters={clearFilters}
					modelsName={modelsName}
				/>

				<ReportsGrid buildUrlWithFilters={buildUrlWithFilters} />
			</Box>
		</AuthenticatedLayout>
	);
}
