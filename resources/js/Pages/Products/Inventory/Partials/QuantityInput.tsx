import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface Stock extends Item {
	stock?: number;
}

type Props = {
	productInfo: Stock | null;
	name?: string;
};

export default function QuantityInput({ productInfo, name = "stock" }: Props) {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext();

	return (
		<div className="flex items-start gap-3 max-md:flex-col max-md:items-center">
			<TextField
				{...register(name, {
					required: "Este campo es obligatorio",
					valueAsNumber: true,
					validate: {
						noCero: (v) =>
							(typeof v === "number" && !Number.isNaN(v) && v !== 0) ||
							"No puede ser 0",
						entero: (v) => Number.isInteger(v) || "Solo números enteros",
						noNegativo: (v) =>
							(typeof v === "number" &&
								(productInfo?.stock ?? 0) + Number(v) >=
									0) ||
							"No puede quedar stock negativo",
					},
				})}
				label="Cantidad"
				type="number"
				onKeyDown={(e) => {
					if ([".", ",", "+", "e", "E"].includes(e.key)) {
						e.preventDefault();
					}
				}}
				required
				error={!!errors.stock}
				helperText={errors.stock?.message as string}
				fullWidth
			/>
			<div className="flex gap-3">
				<div className="flex flex-col items-center min-w-[100px] px-2 py-1 rounded border border-blue-200 bg-blue-50">
					<span className="text-xs text-blue-700 mb-1 font-medium">Actual</span>
					<span className="text-base font-semibold text-blue-700">
						{productInfo?.stock ?? 0}
					</span>
				</div>
				<div className="flex flex-col items-center min-w-[100px] px-2 py-1 rounded border border-green-200 bg-green-50">
					<span className="text-xs text-green-700 mb-1 font-medium">
						Después
					</span>
					<span className="text-base font-semibold text-green-700">
						{(productInfo?.stock ?? 0) +
							(Number(watch(name)) || 0)}
					</span>
				</div>
			</div>
		</div>
	);
}
