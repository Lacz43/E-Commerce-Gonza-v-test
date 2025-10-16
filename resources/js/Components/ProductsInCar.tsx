import { Add, Delete, Remove } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { type HTMLAttributes, useMemo, useState } from "react";
import shoppingCart from "@/shoppingCart";
import { imageUrl } from "@/utils";

type Props = HTMLAttributes<HTMLDivElement> & { item: Item };

export default function ProductsInCar({ item }: Props) {
	const cart = new shoppingCart();
	const [line, setLine] = useState<number | null>(null);

	function showCart(id: number | string | null) {
		const remInPx = Number.parseFloat(
			getComputedStyle(document.documentElement).fontSize, // mover a utils
		);
		const idx = Number(id);
		if (window.innerWidth >= 45 * remInPx) return;
		if (idx === line) setLine(null);
		else setLine(idx);
	}

	const totalFormatted = useMemo(
		() => ((item.quantity ?? 1) * item.price).toFixed(2),
		[item.quantity, item.price],
	);

	const qty = item.quantity ?? 1;
	const canDecrease = qty > 1;

	return (
		<div className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-orange-50/30 border-2 border-orange-100/50 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 group">
			<button
				type="button"
				onClick={() => showCart(item.id)}
				className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer select-none text-left bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg"
			>
				<div className="w-20 h-20 flex items-center justify-center rounded-xl overflow-hidden ring-2 ring-orange-200/50 bg-gradient-to-br from-orange-50 to-emerald-50 group-hover:ring-emerald-300 transition-all duration-200 shadow-sm">
					<img
						src={imageUrl(item.default_image?.image ?? "")}
						alt={item.name}
						className="object-cover w-full h-full"
						loading="lazy"
					/>
				</div>
				<div
					className={`${line === item.id ? "max-md:hidden" : "flex"} flex-col flex-1 min-w-0`}
				>
					<p className="font-bold text-slate-800 truncate text-base group-hover:text-orange-600 transition-colors">
						{item.name}
					</p>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-sm font-semibold text-emerald-600">
							${item.price}
						</span>
						<span className="text-xs text-slate-400">•</span>
						<span className="md:hidden text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
							x{qty}
						</span>
					</div>
				</div>
				<div
					className={`${line === item.id ? "max-md:hidden" : "block"} text-right`}
				>
					<p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
						Total
					</p>
					<p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
						${totalFormatted}
					</p>
				</div>
			</button>

			<div
				className={`flex items-center gap-2 ${line !== item.id ? "max-md:hidden" : ""}`}
			>
				<Tooltip
					title={canDecrease ? "Disminuir" : "Mínimo 1"}
					arrow
					disableInteractive
				>
					<span>
						<IconButton
							size="small"
							color={canDecrease ? "primary" : "default"}
							disabled={!canDecrease}
							onClick={() => cart.update(Number(item.id), qty - 1)}
							className="!w-10 !h-10 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-600 disabled:opacity-40 shadow-sm hover:shadow-md transition-all duration-200 border border-emerald-200/50"
						>
							<Remove fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
				<div className="px-3 py-1 text-base font-bold tabular-nums bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent min-w-[3ch] text-center">
					{qty}
				</div>
				<Tooltip title="Aumentar" arrow disableInteractive>
					<IconButton
						size="small"
						color="primary"
						onClick={() => cart.update(Number(item.id), qty + 1)}
						className="!w-10 !h-10 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-600 shadow-sm hover:shadow-md transition-all duration-200 border border-orange-200/50"
					>
						<Add fontSize="small" />
					</IconButton>
				</Tooltip>
				<div className="w-px h-8 bg-slate-200 mx-1"></div>
				<Tooltip title="Eliminar" arrow disableInteractive>
					<IconButton
						size="small"
						onClick={() => cart.remove(Number(item.id))}
						className="!w-10 !h-10 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 shadow-sm hover:shadow-md transition-all duration-200 border border-red-200/50"
					>
						<Delete fontSize="small" />
					</IconButton>
				</Tooltip>
			</div>

			{/* Mobile expanded total */}
			{line === item.id && (
				<div className="md:hidden text-right ml-2">
					<p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
						Total
					</p>
					<p className="text-base font-bold bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
						${totalFormatted}
					</p>
				</div>
			)}
		</div>
	);
}
