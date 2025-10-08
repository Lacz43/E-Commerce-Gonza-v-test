import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import type React from "react";
import { Bar } from "react-chartjs-2";
import { getPeriodLabel } from "@/utils";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface OrdersChartProps {
	ordersByMonth: Record<
		string,
		Array<{ period: string; total_orders: number; status: string }>
	>;
	period: string;
}

const OrdersChart: React.FC<OrdersChartProps> = ({ ordersByMonth, period }) => {
	const labels = Object.keys(ordersByMonth);
	const pendingData = labels.map(
		(month) =>
			ordersByMonth[month].find((item) => item.status === "pending")
				?.total_orders || 0,
	);
	const paidData = labels.map(
		(month) =>
			ordersByMonth[month].find((item) => item.status === "paid")
				?.total_orders || 0,
	);
	const completedData = labels.map(
		(month) =>
			ordersByMonth[month].find((item) => item.status === "completed")
				?.total_orders || 0,
	);

	const data = {
		labels,
		datasets: [
			{
				label: "Pendientes",
				data: pendingData,
				backgroundColor: "rgba(255, 206, 86, 0.2)",
				borderColor: "rgba(255, 206, 86, 1)",
				borderWidth: 1,
			},
			{
				label: "Pagados",
				data: paidData,
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
			},
			{
				label: "Completados",
				data: completedData,
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Pedidos por {getPeriodLabel(period)}
			</h3>
			<Bar data={data} />
		</div>
	);
};

export default OrdersChart;
