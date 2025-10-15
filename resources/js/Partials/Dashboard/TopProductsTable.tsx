import { useState } from "react";
import { imageUrl } from "@/utils";
import { Box, Typography, FormControl, Select, MenuItem, Avatar, Chip } from "@mui/material";
import { Star, TrendingUp } from "@mui/icons-material";

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
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Box
						sx={{
							background: selectedType === "sold" 
								? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
								: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
							borderRadius: 2,
							padding: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{selectedType === "sold" ? (
							<TrendingUp sx={{ color: "white", fontSize: 24 }} />
						) : (
							<Star sx={{ color: "white", fontSize: 24 }} />
						)}
					</Box>
					<Typography variant="h6" fontWeight={600} color="text.primary">
						Productos {selectedType === "sold" ? "Más Vendidos" : "con Mejor Rating"}
					</Typography>
				</Box>
				<FormControl size="small" sx={{ minWidth: 150 }}>
					<Select
						value={selectedType}
						onChange={(e) => handleTypeChange(e.target.value as "sold" | "rating")}
						sx={{
							borderRadius: 2,
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(5, 150, 105, 0.3)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "#10b981",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "#10b981",
							},
						}}
					>
						<MenuItem value="sold">Más Vendidos</MenuItem>
						<MenuItem value="rating">Mejor Rating</MenuItem>
					</Select>
				</FormControl>
			</Box>
			{topProducts.length === 0 ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
					No hay datos disponibles.
				</Typography>
			) : (
				<Box sx={{ overflowX: "auto" }}>
					{topProducts.map((product, index) => (
						<Box
							key={product.name}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								py: 2,
								px: 1,
								borderBottom: index < topProducts.length - 1 ? "1px solid" : "none",
								borderColor: "rgba(5, 150, 105, 0.1)",
								transition: "all 0.2s ease",
								"&:hover": {
									backgroundColor: "rgba(5, 150, 105, 0.05)",
									borderRadius: 2,
								},
							}}
						>
							<Avatar
								src={product.image ? imageUrl(product.image) : "/placeholder-product.png"}
								alt={product.name}
								sx={{ width: 56, height: 56, borderRadius: 2 }}
								variant="rounded"
							/>
							<Box sx={{ flex: 1 }}>
								<Typography variant="body1" fontWeight={600} color="text.primary">
									{product.name}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{selectedType === "sold" ? "Unidades vendidas" : "Calificación promedio"}
								</Typography>
							</Box>
							<Chip
								label={
									selectedType === "sold"
										? product.total_sold || 0
										: `${Number(product.average_rating || 0)?.toFixed(1)} ★`
								}
								color={selectedType === "sold" ? "success" : "warning"}
								sx={{
									fontWeight: 700,
									minWidth: 60,
								}}
							/>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
};

export default TopProductsTable;
