import { Box, type SvgIconProps, Typography } from "@mui/material";
import type React from "react";

interface PageHeaderProps {
	title: string;
	icon: React.ComponentType<SvgIconProps>;
	subtitle?: string;
	gradientColor?: string;
	iconSize?: number;
}

export default function PageHeader({
	title,
	icon: Icon,
	subtitle = "",
	gradientColor = "#10b981",
	iconSize = 32,
}: PageHeaderProps) {
	// Calcular color más oscuro para el gradiente
	const getDarkerColor = (color: string) => {
		if (color.startsWith("#")) {
			// Simple darken by reducing brightness
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			const darkerR = Math.floor(r * 0.7);
			const darkerG = Math.floor(g * 0.7);
			const darkerB = Math.floor(b * 0.7);
			return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
		}
		return color;
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
			<Box
				sx={{
					background: `linear-gradient(135deg, ${gradientColor} 0%, ${getDarkerColor(gradientColor)} 100%)`,
					borderRadius: 2,
					p: 1.5,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minWidth: 40,
					minHeight: 40,
				}}
			>
				<Icon sx={{ color: "white", fontSize: iconSize }} />
			</Box>
			<Box>
				<Typography variant="h4" fontWeight={700} color="text.primary">
					{title}
				</Typography>
				{subtitle && (
					<Typography variant="body2" color="text.secondary">
						{subtitle}
					</Typography>
				)}
			</Box>
		</Box>
	);
}
