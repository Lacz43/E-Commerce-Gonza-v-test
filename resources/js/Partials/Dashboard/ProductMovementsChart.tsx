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
import { TrendingUp } from "@mui/icons-material";

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

interface ProductMovementsChartProps {
	movements: Record<
		string,
		Array<{ period: string; type: string; total_quantity: number }>
	>;
	period: string;
}

const ProductMovementsChart: React.FC<ProductMovementsChartProps> = ({
	movements,
	period,
}) => {
	const labels = Object.keys(movements);
	const inData = labels.map(
		(month) =>
			movements[month].find((item) => item.type === "ingress")
				?.total_quantity || 0,
	);
	const outData = labels.map((month) =>
		Math.abs(
			movements[month].find((item) => item.type === "egress")?.total_quantity ||
				0,
		),
	);

	const data = {
		labels,
		datasets: [
			{
				label: "Entradas",
				data: inData,
				borderColor: "#10b981",
				backgroundColor: "rgba(16, 185, 129, 0.1)",
				borderWidth: 3,
				tension: 0.4,
				fill: true,
				pointBackgroundColor: "#10b981",
				pointBorderColor: "#fff",
				pointBorderWidth: 2,
				pointRadius: 5,
				pointHoverRadius: 7,
			},
			{
				label: "Salidas",
				data: outData,
				borderColor: "#f97316",
				backgroundColor: "rgba(249, 115, 22, 0.1)",
				borderWidth: 3,
				tension: 0.4,
				fill: true,
				pointBackgroundColor: "#f97316",
				pointBorderColor: "#fff",
				pointBorderWidth: 2,
				pointRadius: 5,
				pointHoverRadius: 7,
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
						background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
						borderRadius: 2,
						padding: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TrendingUp sx={{ color: "white", fontSize: 24 }} />
				</Box>
				<Typography variant="h6" fontWeight={600} color="text.primary">
					Movimientos de Productos por {getPeriodLabel(period)}
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

export default ProductMovementsChart;
