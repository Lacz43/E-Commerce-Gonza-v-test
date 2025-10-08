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
	movements: Record<string, Array<{ month: string; type: string; total_quantity: number }>>;
}

const ProductMovementsChart: React.FC<ProductMovementsChartProps> = ({
	movements,
}) => {
	const labels = Object.keys(movements);
	const inData = labels.map((month) =>
		movements[month].find((item) => item.type === "ingress")?.total_quantity || 0
	);
	const outData = labels.map((month) =>
		Math.abs(movements[month].find((item) => item.type === "egress")?.total_quantity || 0)
	);

	const data = {
		labels,
		datasets: [
			{
				label: "Entradas",
				data: inData,
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
			},
			{
				label: "Salidas",
				data: outData,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.2)",
			},
		],
	};

	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Movimientos de Productos
			</h3>
			<Line data={data} />
		</div>
	);
};

export default ProductMovementsChart;
