import type { FieldValues, Path } from "react-hook-form";
import SelectProduct from "@/Components/Products/SelectProduct";

type Props<T extends FieldValues> = {
	name: Path<T>;
	id?: number;
};

export default function ProductSelector<T extends FieldValues>({
	name,
	id,
}: Props<T>) {
	return <SelectProduct<T> name={name} id={id} />;
}
