import type React from "react";

interface LowStockTableProps {
	lowStockProducts: Array<{ name: string; stock: number }>;
}

const LowStockTable: React.FC<LowStockTableProps> = ({ lowStockProducts }) => {
	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Productos con Stock Bajo
			</h3>
			{lowStockProducts.length === 0 ? (
				<p className="text-gray-500">No hay productos con stock bajo.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Producto
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Stock Actual
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{lowStockProducts.map((product) => (
								<tr key={product.name}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{product.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{product.stock}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default LowStockTable;
