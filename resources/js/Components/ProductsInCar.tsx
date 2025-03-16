import { imageUrl } from "@/utils";
import { Remove, Add, Delete } from "@mui/icons-material";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { item: Item };

export default function ProductsInCar({ item }: Props) {
	return (
		<div className="flex w-full items-center">
			<div className="size-20 flex mr-2 p-1">
				<img
					src={imageUrl(item.image)}
					alt=""
					className="object-cover mx-auto"
				/>
			</div>
			<div className="grow">
				<p className="font-bold">{item.name}</p>
				<p className="font-light">{item.price} $</p>
			</div>
			<div className="">{(item.quantity ?? 1) * item.price} $</div>
			<div className="ml-2 flex items-center">
				<button
					type="button"
					className="bg-blue-800 text-white m-1 px-2 py-1 text-xl rounded-sm"
				>
					<Remove />
				</button>
				<p className="font-bold mx-3">{item.quantity}</p>
				<button
					type="button"
					className="bg-blue-800 text-white m-1 px-2 py-1 text-xl rounded-sm"
				>
					<Add />
				</button>
				<button
					type="button"
					className="bg-red-600 px-2 py-1 ml-2 text-xl rounded-sm text-white"
				>
					<Delete />
				</button>
			</div>
		</div>
	);
}
