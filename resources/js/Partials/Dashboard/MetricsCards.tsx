import type React from "react";

interface MetricsCardsProps {
	totalStock: number;
	lowStockProducts: Array<{ name: string; stock: number }>;
	totalRevenue: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
	totalStock,
	lowStockProducts,
	totalRevenue,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="bg-white shadow-sm sm:rounded-lg p-6">
				<h3 className="text-lg font-medium text-gray-900">Stock Total</h3>
				<p className="text-2xl font-bold text-blue-600">{totalStock}</p>
			</div>
			<div className="bg-white shadow-sm sm:rounded-lg p-6">
				<h3 className="text-lg font-medium text-gray-900">
					Productos con Bajo Stock
				</h3>
				<p className="text-2xl font-bold text-red-600">
					{lowStockProducts.length}
				</p>
				<ul className="mt-2 text-sm text-gray-600">
					{lowStockProducts.slice(0, 3).map((product) => (
						<li key={product.name}>
							{product.name}: {product.stock}
						</li>
					))}
				</ul>
			</div>
			<div className="bg-white shadow-sm sm:rounded-lg p-6">
				<h3 className="text-lg font-medium text-gray-900">Ingresos Totales</h3>
				<p className="text-2xl font-bold text-green-600">
					${totalRevenue.toFixed(2)}
				</p>
			</div>
		</div>
	);
};

export default MetricsCards;
