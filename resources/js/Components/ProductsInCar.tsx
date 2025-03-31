import shoppingCart from "@/shoppingCart";
import { imageUrl } from "@/utils";
import { Remove, Add, Delete } from "@mui/icons-material";
import { useState, type BaseSyntheticEvent, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { item: Item };

export default function ProductsInCar({ item }: Props) {
	const cart = new shoppingCart();
	const [line, setLine] = useState<number | null>(null);

	function showCart(id: number | null) {
		if (id === line) setLine(null);
		else setLine(id);
	}

	return (
		<div className="flex w-full">
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => showCart(item.id)}
				className="flex w-full items-center"
			>
				<div className="size-20 flex mr-2 p-1">
					<img
						src={imageUrl(item.image)}
						alt=""
						className="object-cover mx-auto"
					/>
				</div>
				<div className={line === item.id ? "max-md:hidden" : "flex w-full"}>
					<div className="grow">
						<p className="font-bold">{item.name}</p>
						<p className="font-light">{item.price} $</p>
					</div>
					<div className="">
						{((item.quantity ?? 1) * item.price).toFixed(2)} $
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<div
					className={`ml-2 flex items-center bg-white right-0 \
					${line !== item.id ? "max-md:hidden" : ""}
                    `}
				>
					<button
						type="button"
						className="bg-blue-800 text-white m-1 px-2 py-1 text-xl rounded-sm"
						onClick={() => cart.update(item.id, (item.quantity ?? 1) - 1)}
					>
						<Remove />
					</button>
					<p className="font-bold mx-3">{item.quantity}</p>
					<button
						type="button"
						className="bg-blue-800 text-white m-1 px-2 py-1 text-xl rounded-sm"
						onClick={() => cart.update(item.id, (item.quantity ?? 1) + 1)}
					>
						<Add />
					</button>
					<button
						type="button"
						className="bg-red-600 px-2 py-1 ml-2 text-xl rounded-sm text-white"
						onClick={() => cart.remove(item.id)}
					>
						<Delete />
					</button>
				</div>
				<div className={line === item.id ? "text-center" : "max-md:hidden"}>
					{((item.quantity ?? 1) * item.price).toFixed(2)} $
				</div>
			</div>
		</div>
	);
}
