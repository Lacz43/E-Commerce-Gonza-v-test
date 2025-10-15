import { Head } from "@inertiajs/react";
import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { TrendingUp, CalendarMonth, ErrorOutline } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import LowStockTable from "@/Partials/Dashboard/LowStockTable";
import MetricsCards from "@/Partials/Dashboard/MetricsCards";
import OrdersChart from "@/Partials/Dashboard/OrdersChart";
import ProductMovementsChart from "@/Partials/Dashboard/ProductMovementsChart";
import RevenueChart from "@/Partials/Dashboard/RevenueChart";
import TopProductsTable from "@/Partials/Dashboard/TopProductsTable";

interface MetricsData {
	product_metrics: {
		movements: Record<
			string,
			Array<{ period: string; type: string; total_quantity: number }>
		>;
		total_stock: number;
		low_stock_products: Array<{ name: string; stock: number }>;
	};
	order_metrics: {
		orders_by_month: Record<
			string,
			Array<{ period: string; total_orders: number; status: string }>
		>;
		revenue_by_month: Array<{ period: string; total_revenue: number }>;
		top_products: Array<{
			name: string;
			total_sold?: number;
			average_rating?: number;
			image?: string;
		}>;
	};
}

export default function Dashboard() {
	const [metrics, setMetrics] = useState<MetricsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState("monthly");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [topProductType, setTopProductType] = useState<"sold" | "rating">(
		"sold",
	);

	useEffect(() => {
		const params: Record<string, string> = {};
		if (period === "custom") {
			params.start_date = startDate;
			params.end_date = endDate;
			params.period = "custom";
		} else {
			params.period = period;
		}
		params.type = topProductType;
		axios
			.get("/metrics/dashboard", { params })
			.then((response) => {
				setMetrics(response.data);
				setLoading(false);
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error fetching metrics:", error);
				setLoading(false);
			});
	}, [period, startDate, endDate, topProductType]);

	if (loading) {
		return (
			<AuthenticatedLayout
				header={
					<div className="flex items-center gap-3">
						<TrendingUp className="text-emerald-600" fontSize="large" />
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
							<p className="text-sm text-gray-600">
								Panel de control y métricas
							</p>
						</div>
					</div>
				}
			>
				<Head title="Dashboard" />
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "60vh",
						flexDirection: "column",
						gap: 3,
					}}
				>
					<CircularProgress size={60} sx={{ color: "#10b981" }} />
					<Typography variant="h6" color="text.secondary">
						Cargando métricas...
					</Typography>
				</Box>
			</AuthenticatedLayout>
		);
	}

	if (!metrics) {
		return (
			<AuthenticatedLayout
				header={
					<div className="flex items-center gap-3">
						<TrendingUp className="text-emerald-600" fontSize="large" />
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
							<p className="text-sm text-gray-600">
								Panel de control y métricas
							</p>
						</div>
					</div>
				}
			>
				<Head title="Dashboard" />
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "60vh",
						flexDirection: "column",
						gap: 3,
					}}
				>
					<ErrorOutline sx={{ fontSize: 80, color: "#ef4444" }} />
					<Typography variant="h6" color="error">
						Error al cargar las métricas
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Por favor, intenta recargar la página
					</Typography>
				</Box>
			</AuthenticatedLayout>
		);
	}

	// Prepare total revenue
	const totalRevenue = metrics.order_metrics.revenue_by_month.reduce(
		(sum, item) => sum + +item.total_revenue,
		0,
	);

	return (
		<AuthenticatedLayout
			header={
				<div className="flex items-center gap-3">
					<TrendingUp className="text-emerald-600" fontSize="large" />
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
						<p className="text-sm text-gray-600">Panel de control y métricas</p>
					</div>
				</div>
			}
		>
			<Head title="Dashboard" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
					{/* Period Selector */}
					<div className="bg-white shadow-sm sm:rounded-lg p-6">
						<div className="flex items-center gap-3 mb-4">
							<CalendarMonth className="text-emerald-600" />
							<Typography variant="h6" fontWeight={600} color="text.primary">
								Seleccionar Período
							</Typography>
						</div>
						<FormControl fullWidth>
							<InputLabel>Período</InputLabel>
							<Select
								value={period}
								label="Período"
								onChange={(e) => setPeriod(e.target.value)}
								sx={{
									borderRadius: 2,
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(5, 150, 105, 0.3)",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "#10b981",
									},
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "#10b981",
									},
								}}
							>
								<MenuItem value="daily">Diario (último día)</MenuItem>
								<MenuItem value="weekly">Semanal (última semana)</MenuItem>
								<MenuItem value="monthly">Mensual (último mes)</MenuItem>
								<MenuItem value="annual">Anual (último año)</MenuItem>
								<MenuItem value="custom">Personalizado</MenuItem>
							</Select>
						</FormControl>
						{period === "custom" && (
							<div className="mt-4 flex gap-4">
								<TextField
									label="Fecha Inicio"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									fullWidth
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Fecha Fin"
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									fullWidth
									InputLabelProps={{ shrink: true }}
								/>
							</div>
						)}
					</div>

					<MetricsCards
						totalStock={metrics.product_metrics.total_stock}
						lowStockProducts={metrics.product_metrics.low_stock_products}
						totalRevenue={totalRevenue}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ProductMovementsChart
							movements={metrics.product_metrics.movements}
							period={period}
						/>
						<OrdersChart
							ordersByMonth={metrics.order_metrics.orders_by_month}
							period={period}
						/>
					</div>

					<RevenueChart
						revenueByMonth={metrics.order_metrics.revenue_by_month}
						period={period}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<TopProductsTable
							topProducts={metrics.order_metrics.top_products}
							onTypeChange={setTopProductType}
						/>
						<LowStockTable
							lowStockProducts={metrics.product_metrics.low_stock_products}
						/>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
