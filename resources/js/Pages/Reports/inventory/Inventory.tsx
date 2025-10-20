import { Head } from "@inertiajs/react";
import { Inventory as InventoryIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./partials/Filters";
import ReportsGrid from "./partials/ReportsGrid";

export default function Inventory() {
	const [filters, setFilters] = useState({
		stockMin: "",
		stockMax: "",
		createdFrom: "",
		createdTo: "",
		updatedFrom: "",
		updatedTo: "",
	});

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const clearFilters = () => {
		setFilters({
			stockMin: "",
			stockMax: "",
			createdFrom: "",
			createdTo: "",
			updatedFrom: "",
			updatedTo: "",
		});
	};

	const buildUrlWithFilters = (baseRoute: string) => {
		const params = new URLSearchParams();

		if (filters.stockMin) params.append("stock_min", filters.stockMin);
		if (filters.stockMax) params.append("stock_max", filters.stockMax);
		if (filters.createdFrom) params.append("created_from", filters.createdFrom);
		if (filters.createdTo) params.append("created_to", filters.createdTo);
		if (filters.updatedFrom) params.append("updated_from", filters.updatedFrom);
		if (filters.updatedTo) params.append("updated_to", filters.updatedTo);

		const queryString = params.toString();
		return queryString
			? `${route(baseRoute)}?${queryString}`
			: route(baseRoute);
	};

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Reportes de Inventario
				</h2>
			}
		>
			<Head title="Reportes de Inventario" />

			<Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
				{/* Header moderno con gradiente */}
				<PageHeader
					title="Reportes de Inventario"
					icon={InventoryIcon}
					subtitle="Reportes de inventario con filtros avanzados"
					gradientColor="#10b981"
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
