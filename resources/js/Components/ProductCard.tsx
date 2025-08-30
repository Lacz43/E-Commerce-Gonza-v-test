import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import type { HTMLAttributes } from "react";
import { imageUrl } from "@/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
	item: Item;
	addCart: (item: Item) => void;
};

export default function ProductCard({
	item,
	className = "",
	addCart,
	...props
}: CardProps) {
	if (!item?.default_image) return null;

	const priceFormatted =
		typeof item.price === "number" ? item.price.toFixed(2) : item.price;

	return (
		<div {...props} className={`relative group ${className}`}>
			{/* Gradient background frame */}
			<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-100 via-emerald-50 to-green-100 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

			{/* Card surface */}
			<div className="relative flex flex-col h-full rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-orange-100/40 ring-1 ring-black/5 overflow-hidden">
				{/* Media */}
				<div className="relative w-full h-56 overflow-hidden">
					<img
						src={imageUrl(item.default_image.image)}
						alt={item.name || "Producto"}
						className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
						loading="lazy"
					/>
					{/* Subtle top gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/0 pointer-events-none" />
				</div>

				{/* Content */}
				<div className="flex flex-col p-6 md:p-7 mt-auto">
					<div className="flex items-start justify-between gap-3">
						<h3 className="text-xl font-semibold tracking-tight text-slate-900">
							{item.name}
						</h3>
						{/* Static rating placeholder */}
						<div
							className="flex items-center gap-0.5 text-amber-400"
							aria-label="Valoración (placeholder)"
						>
							{Array.from({ length: 4 }).map((_, i) => (
								<StarIcon key={i} fontSize="small" />
							))}
							<StarIcon fontSize="small" className="text-slate-300" />
						</div>
					</div>

					<div className="mt-3 mb-4 flex items-baseline gap-2">
						<span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
							{priceFormatted} Bs
						</span>
						{/* <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">-10% OFF</span> */}
					</div>

					{item.description && (
						<p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
							{item.description}
						</p>
					)}

					{/* Placeholder extra details section (añade/activa cuando tengas datos) */}
					{/*
					<div className="mt-5 grid grid-cols-2 gap-4 text-xs text-slate-500">
						<div>
							<span className="block font-medium text-slate-400">Código</span>
							<span className="text-slate-700">{item.barcode || '—'}</span>
						</div>
						<div>
							<span className="block font-medium text-slate-400">Stock</span>
							<span className="text-slate-700">{(item as any).stock ?? '—'}</span>
						</div>
					</div>
					<div className="mt-3 flex flex-wrap gap-2">
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-600">Nuevo</span>
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-600">Eco</span>
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600">Top</span>
					</div>
					*/}

					<div className="mt-6">
						<Button
							fullWidth
							size="large"
							variant="contained"
							endIcon={<ShoppingCartIcon />}
							sx={{
								color: "#FFFFFF",
								textTransform: "none",
								fontWeight: 600,
								letterSpacing: ".5px",
								borderRadius: "1rem",
								paddingY: 1.2,
								background: "linear-gradient(90deg,rgba(255, 124, 10, 1) 12%, rgba(0, 214, 89, 1) 80%, rgba(237, 221, 83, 1) 100%)", // darker orange (600) to teal/emerald (600)
								boxShadow: "0 4px 14px 0 rgba(13,148,136,.35)",
								"&:hover": {
									background: "linear-gradient(90deg,rgba(199, 95, 4, 1) 12%, rgba(0, 186, 78, 1) 80%, rgba(199, 186, 72, 1) 100%)", // even darker on hover
									boxShadow: "0 6px 20px 0 rgba(13,148,136,.45)",
								},
								"& .MuiButton-endIcon": { color: "rgba(255,255,255,0.9)" },
								"&:active": { transform: "translateY(1px)" },
								"&:focus-visible": {
									outline: "2px solid #0d9488",
									outlineOffset: "2px",
								},
							}}
							onClick={() =>
								addCart({
									id: item.id,
									default_image: item.default_image,
									name: item.name,
									price: item.price,
									barcode: item.barcode,
								} as Item)
							}
						>
							Añadir
						</Button>
					</div>
				</div>

				{/* Decorative subtle gradient bottom bar */}
				<div className="h-1 w-full bg-gradient-to-r from-orange-200 via-emerald-100 to-green-200" />
			</div>
		</div>
	);
}
