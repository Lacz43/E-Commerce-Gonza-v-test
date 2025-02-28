import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & { item: Item };

export default function ProductCard({ item, className, ...props }: CardProps) {
	return (
		<div
			{...props}
			className={`flex flex-col rounded-2xl w-auto bg-white shadow-xl ${className}`}
		>
			<figure className="flex justify-center items-center rounded-2xl size-80">
				<img
					src="https://www.supergarzon.com/site/pueblonuevo/5456-large_default/harina-pan-1kg-maiz.jpg"
					alt="Card Preview"
					className="rounded-t-2xl"
				/>
			</figure>
			<div className="flex flex-col p-8 border-t border-t-gray-300">
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
					<button
						type="button"
						className="bg-[#7e22ce] text-[#ffffff] w-full font-bold text-base  p-3 rounded-lg hover:bg-purple-800 active:scale-95 transition-transform transform"
					>
						Añadir
					</button>
				</div>
			</div>
		</div>
	);
}
