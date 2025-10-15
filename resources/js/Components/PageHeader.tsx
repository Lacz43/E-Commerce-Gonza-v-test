import { Box, type SvgIconProps, Typography } from "@mui/material";
import type React from "react";

interface PageHeaderProps {
	title: string;
	icon: React.ComponentType<SvgIconProps>;
	subtitle?: string;
}

export default function PageHeader({
	title,
	icon: Icon,
	subtitle = "",
}: PageHeaderProps) {
	return (
		<Box
			sx={{
				mb: 4,
				p: 4,
				borderRadius: 3,
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				color: "white",
				boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
				<Icon sx={{ fontSize: 40 }} />
				<Typography variant="h3" component="h1" fontWeight="bold">
					{title}
				</Typography>
			</Box>
			<Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 300 }}>
				{subtitle}
			</Typography>
		</Box>
	);
}
