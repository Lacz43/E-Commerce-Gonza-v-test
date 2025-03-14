import { imageUrl } from "@/utils";
import { Remove, Add, Delete } from "@mui/icons-material";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { item: Item };

export default function ProductsInCar({ item }: Props) {
	return (
		<div className="flex w-full items-center">
			<div className="">
				<img src={imageUrl(item.image)} alt="" />
			</div>
			<div className="grow">
				<p className="font-bold">{item.name}</p>
				<p className="font-light">{item.price} $</p>
			</div>
			<div className="">12 $</div>
			<div className="ml-2 flex items-center">
				<button
					type="button"
					className="bg-blue-800 text-white m-1 px-2 py-1 text-xl rounded-sm"
				>
					<Remove />
				</button>
				<p className="font-bold mx-3">5</p>
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
