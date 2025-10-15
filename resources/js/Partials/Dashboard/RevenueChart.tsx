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
import { Line } from "react-chartjs-2";
import { getPeriodLabel } from "@/utils";
import { Box, Typography } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";

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

interface RevenueChartProps {
	revenueByMonth: Array<{ period: string; total_revenue: number }>;
	period: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
	revenueByMonth,
	period,
}) => {
	const labels = revenueByMonth.map((item) => item.period);
	const dataValues = revenueByMonth.map((item) => item.total_revenue);

	const data = {
		labels,
		datasets: [
			{
				label: "Ingresos",
				data: dataValues,
				borderColor: "#f97316",
				backgroundColor: "rgba(249, 115, 22, 0.1)",
				borderWidth: 3,
				tension: 0.4,
				fill: true,
				pointBackgroundColor: "#f97316",
				pointBorderColor: "#fff",
				pointBorderWidth: 2,
				pointRadius: 6,
				pointHoverRadius: 8,
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
				borderColor: "rgba(249, 115, 22, 0.15)",
				transition: "all 0.3s ease",
				"&:hover": {
					boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
				},
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<Box
					sx={{
						background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
						borderRadius: 2,
						padding: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<AttachMoney sx={{ color: "white", fontSize: 28 }} />
				</Box>
				<Typography variant="h6" fontWeight={600} color="text.primary">
					Ingresos por {getPeriodLabel(period)}
				</Typography>
			</Box>
			<Line 
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
								color: "rgba(249, 115, 22, 0.1)",
							},
							ticks: {
								callback: (value) => {
									return '$' + value.toLocaleString();
								},
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

export default RevenueChart;
