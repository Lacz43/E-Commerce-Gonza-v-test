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
				borderColor: "rgb(153, 102, 255)",
				backgroundColor: "rgba(153, 102, 255, 0.2)",
			},
		],
	};

	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Ingresos por {getPeriodLabel(period)}
			</h3>
			<Line data={data} />
		</div>
	);
};

export default RevenueChart;
