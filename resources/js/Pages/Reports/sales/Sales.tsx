import { Head } from "@inertiajs/react";
import { TrendingUp } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./partials/Filters";
import ReportsGrid from "./partials/ReportsGrid";

export default function Sales() {
	const [filters, setFilters] = useState({
		status: "",
		dateFrom: "",
		dateTo: "",
	});

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const clearFilters = () => {
		setFilters({
			status: "",
			dateFrom: "",
			dateTo: "",
		});
	};

	const buildUrlWithFilters = (baseRoute: string) => {
		const params = new URLSearchParams();

		if (filters.status) params.append("status", filters.status);
		if (filters.dateFrom) params.append("date_from", filters.dateFrom);
		if (filters.dateTo) params.append("date_to", filters.dateTo);

		const queryString = params.toString();
		return queryString
			? `${route(baseRoute)}?${queryString}`
			: route(baseRoute);
	};

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Reportes de Ventas
				</h2>
			}
		>
			<Head title="Reportes de Ventas" />

			<Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
				<PageHeader
					title="Reportes de Ventas"
					icon={TrendingUp}
					subtitle="Análisis completo de ventas, órdenes y rendimiento comercial"
					gradientColor="#ef4444"
				/>

				<Filters
					filters={filters}
					handleFilterChange={handleFilterChange}
					clearFilters={clearFilters}
				/>

				<ReportsGrid buildUrlWithFilters={buildUrlWithFilters} />
			</Box>
		</AuthenticatedLayout>
	);
}
