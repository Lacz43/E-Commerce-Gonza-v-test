import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MetricsCards from "@/Partials/Dashboard/MetricsCards";
import OrdersChart from "@/Partials/Dashboard/OrdersChart";
import ProductMovementsChart from "@/Partials/Dashboard/ProductMovementsChart";
import RevenueChart from "@/Partials/Dashboard/RevenueChart";

interface MetricsData {
	product_metrics: {
		movements: Record<
			string,
			Array<{ month: string; type: string; total_quantity: number }>
		>;
		total_stock: number;
		low_stock_products: Array<{ name: string; stock: number }>;
	};
	order_metrics: {
		orders_by_month: Record<
			string,
			Array<{ month: string; total_orders: number; status: string }>
		>;
		revenue_by_month: Array<{ month: string; total_revenue: number }>;
	};
}

export default function Dashboard() {
	const [metrics, setMetrics] = useState<MetricsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/metrics/dashboard")
			.then((response) => {
				setMetrics(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching metrics:", error);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<AuthenticatedLayout
				header={
					<h2 className="text-xl font-semibold leading-tight text-gray-800">
						Dashboard
					</h2>
				}
			>
				<Head title="Dashboard" />
				<div className="py-12">
					<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="bg-white shadow-sm sm:rounded-lg p-6">
							Loading...
						</div>
					</div>
				</div>
			</AuthenticatedLayout>
		);
	}

	if (!metrics) {
		return (
			<AuthenticatedLayout
				header={
					<h2 className="text-xl font-semibold leading-tight text-gray-800">
						Dashboard
					</h2>
				}
			>
				<Head title="Dashboard" />
				<div className="py-12">
					<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="bg-white shadow-sm sm:rounded-lg p-6">
							Error loading metrics.
						</div>
					</div>
				</div>
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
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Dashboard
				</h2>
			}
		>
			<Head title="Dashboard" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
					<MetricsCards
						totalStock={metrics.product_metrics.total_stock}
						lowStockProducts={metrics.product_metrics.low_stock_products}
						totalRevenue={totalRevenue}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ProductMovementsChart
							movements={metrics.product_metrics.movements}
						/>
						<OrdersChart
							ordersByMonth={metrics.order_metrics.orders_by_month}
						/>
					</div>

					<RevenueChart
						revenueByMonth={metrics.order_metrics.revenue_by_month}
					/>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
