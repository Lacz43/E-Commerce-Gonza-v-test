import type { HTMLAttributes } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import { imageUrl } from "@/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & { item: Item, addCart: (item: Item) => void};

export default function ProductCard({ item, className, addCart, ...props }: CardProps) {
	return (
		<div
			{...props}
			className={`flex flex-col rounded-2xl w-auto bg-white shadow-xl ${className}`}
		>
			<div className="flex justify-center items-center rounded-2xl">
				<img
					src={imageUrl(item.image)}
					alt="Card Preview"
					className="rounded-t-2xl w-full h-full object-cover"
				/>
			</div>
			<div className="flex flex-col p-8 border-t border-t-gray-300 mt-auto">
				<div className="text-2xl font-bold text-[#374151] pb-6">
					{item.name}
				</div>
				<div className="text-xl font-bold pb-4 text-[#374151]">
					{item.price} Bs
				</div>
				{item.description && (
					<div className=" text-base text-[#374151]">{item.description}</div>
				)}
				<div className="flex justify-end pt-6">
					<Button
						size="large"
						variant="contained"
						endIcon={<ShoppingCartIcon />}
						className="w-full"
                        onClick={() => addCart(item)}
					>
						Añadir
					</Button>
				</div>
			</div>
		</div>
	);
}
