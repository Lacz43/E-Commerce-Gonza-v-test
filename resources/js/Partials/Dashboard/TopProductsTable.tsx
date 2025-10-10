import type React from "react";
import { imageUrl } from "@/utils";

interface TopProductsTableProps {
	topProducts: Array<{ name: string; total_sold: number; image?: string }>;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ topProducts }) => {
	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Productos Más Vendidos
			</h3>
			{topProducts.length === 0 ? (
				<p className="text-gray-500">No hay datos disponibles.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Imagen
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Producto
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Cantidad Vendida
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{topProducts.map((product) => (
								<tr key={product.name}>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<img
											src={
												product.image
													? imageUrl(product.image)
													: "/placeholder-product.png"
											}
											alt={product.name}
											className="w-12 h-12 object-cover rounded"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{product.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{product.total_sold}
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

export default TopProductsTable;
