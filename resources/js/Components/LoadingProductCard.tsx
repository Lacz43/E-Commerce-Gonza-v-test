import type { HTMLAttributes } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function LoadingProductCard({ className, ...props }: CardProps) {
	return (
		<div
			{...props}
			className={`rounded-2xl w-auto bg-white shadow-xl ${className} loader`}
		>
			<figure className="flex justify-center items-center rounded-2xl size-80" />
			<div className="flex flex-col p-8 border-t border-t-gray-300">
				<div className="justify-end pt-6">
					<Button
						size="large"
						variant="contained"
						endIcon={<ShoppingCartIcon />}
						className="w-full"
						disabled
					>
						Añadir
					</Button>
				</div>
			</div>
		</div>
	);
}
