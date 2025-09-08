import { Skeleton } from "@mui/material";
import { type ImgHTMLAttributes, useState } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
	fallbackSrc?: string; // Imagen de respaldo si falla la carga
}

export default function Image({
	src,
	alt,
	fallbackSrc,
	width,
	height,
	style,
	...props
}: ImageProps) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	const handleLoad = () => {
		setLoaded(true);
	};

	const handleError = () => {
		setError(true);
		if (fallbackSrc) {
			setLoaded(true); // Mostrar fallback como imagen cargada
		}
	};

	const displaySrc = error && fallbackSrc ? fallbackSrc : src;

	return (
		<div
			style={{
				position: "relative",
				width: typeof width === "number" ? `${width}px` : width,
				height: typeof height === "number" ? `${height}px` : height,
				...style,
			}}
		>
			{/* Skeleton mientras carga */}
			{!loaded && (
				<Skeleton
					variant="rectangular"
					width="100%"
					height="100%"
					animation="wave"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 1,
						borderRadius: style?.borderRadius,
					}}
				/>
			)}

			{/* Imagen real (o fallback) */}
			<img
				src={displaySrc}
				alt={alt}
				width={width}
				height={height}
				onLoad={handleLoad}
				onError={handleError}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover", // o "contain", según necesites
					opacity: loaded ? 1 : 0,
					transition: "opacity 0.3s ease-in-out",
				}}
				{...props}
			/>
		</div>
	);
}
