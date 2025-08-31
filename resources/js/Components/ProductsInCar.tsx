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
		<div className="w-full flex items-center gap-4 py-3 px-2 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100 hover:shadow-md transition-shadow">
			<button
				type="button"
				onClick={() => showCart(item.id)}
				className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none text-left bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg"
			>
				<div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden ring-1 ring-orange-100 bg-orange-50">
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
					<p className="font-semibold text-slate-800 truncate">{item.name}</p>
					<p className="text-sm text-slate-500">
						{item.price} ${" "}
						<b className="md:hidden font-medium text-slate-600">x{qty}</b>
					</p>
				</div>
				<div
					className={`${line === item.id ? "max-md:hidden" : "block"} text-right text-sm font-medium text-slate-700 w-20`}
				>
					{totalFormatted} $
				</div>
			</button>

			<div
				className={`flex items-center gap-1 ${line !== item.id ? "max-md:hidden" : ""}`}
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
							className="!w-9 !h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:opacity-40"
						>
							<Remove fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
				<div className="px-2 text-sm font-semibold tabular-nums text-slate-700 min-w-[2ch] text-center">
					{qty}
				</div>
				<Tooltip title="Aumentar" arrow disableInteractive>
					<IconButton
						size="small"
						color="primary"
						onClick={() => cart.update(Number(item.id), qty + 1)}
						className="!w-9 !h-9 bg-orange-50 hover:bg-orange-100 text-orange-600"
					>
						<Add fontSize="small" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Eliminar" arrow disableInteractive>
					<IconButton
						size="small"
						onClick={() => cart.remove(Number(item.id))}
						className="!w-9 !h-9 bg-red-50 hover:bg-red-100 text-red-600"
					>
						<Delete fontSize="small" />
					</IconButton>
				</Tooltip>
			</div>

			{/* Mobile expanded total */}
			{line === item.id && (
				<div className="md:hidden text-right text-sm font-medium text-slate-700 ml-2 w-16">
					{totalFormatted} $
				</div>
			)}
		</div>
	);
}
