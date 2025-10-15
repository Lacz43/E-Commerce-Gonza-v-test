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
import { Box, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

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
				backgroundColor: "rgba(251, 191, 36, 0.8)",
				borderColor: "#f59e0b",
				borderWidth: 2,
				borderRadius: 8,
			},
			{
				label: "Pagados",
				data: paidData,
				backgroundColor: "rgba(14, 165, 233, 0.8)",
				borderColor: "#0ea5e9",
				borderWidth: 2,
				borderRadius: 8,
			},
			{
				label: "Completados",
				data: completedData,
				backgroundColor: "rgba(16, 185, 129, 0.8)",
				borderColor: "#10b981",
				borderWidth: 2,
				borderRadius: 8,
			},
		],
	};

	return (
		<Box
			sx={{
				background: "white",
				borderRadius: 3,
				padding: 3,
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
				border: "1px solid",
				borderColor: "rgba(5, 150, 105, 0.15)",
				transition: "all 0.3s ease",
				"&:hover": {
					boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
				},
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<Box
					sx={{
						background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
						borderRadius: 2,
						padding: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ShoppingCart sx={{ color: "white", fontSize: 24 }} />
				</Box>
				<Typography variant="h6" fontWeight={600} color="text.primary">
					Pedidos por {getPeriodLabel(period)}
				</Typography>
			</Box>
			<Bar 
				data={data}
				options={{
					responsive: true,
					plugins: {
						legend: {
							position: "top" as const,
							labels: {
								font: {
									size: 12,
									weight: "bold" as const,
								},
								usePointStyle: true,
								padding: 15,
							},
						},
					},
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								color: "rgba(5, 150, 105, 0.1)",
							},
						},
						x: {
							grid: {
								display: false,
							},
						},
					},
				}}
			/>
		</Box>
	)
};

export default OrdersChart;
