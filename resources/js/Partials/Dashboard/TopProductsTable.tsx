import { useState } from "react";
import { imageUrl } from "@/utils";

interface topProductsProps {
	topProducts: Array<{
		name: string;
		total_sold?: number;
		average_rating?: number;
		image?: string;
	}>;
	onTypeChange: (type: "sold" | "rating") => void;
}

const TopProductsTable = ({ topProducts, onTypeChange }: topProductsProps) => {
	const [selectedType, setSelectedType] = useState<"sold" | "rating">("sold");

	const handleTypeChange = (type: "sold" | "rating") => {
		setSelectedType(type);
		onTypeChange(type);
	};

	return (
		<div className="bg-white shadow-sm sm:rounded-lg p-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-medium text-gray-900">
					Productos{" "}
					{selectedType === "sold" ? "Más Vendidos" : "con Mejor Rating"}
				</h3>
				<select
					value={selectedType}
					onChange={(e) =>
						handleTypeChange(e.target.value as "sold" | "rating")
					}
					className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="sold">Más Vendidos</option>
					<option value="rating">Mejor Rating</option>
				</select>
			</div>
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
									{selectedType === "sold"
										? "Cantidad Vendida"
										: "Promedio de Rating"}
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
											loading="lazy"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{product.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{selectedType === "sold"
											? product.total_sold || 0
											: Number(product.average_rating || 0)?.toFixed(1)}
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
