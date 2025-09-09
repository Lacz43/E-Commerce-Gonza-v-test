import { Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import Image from "@/Components/Image";
import ModalStyled from "@/Components/Modals/ModalStyled";
import SelectProduct from "@/Components/Products/SelectProduct";
import { imageUrl } from "@/utils";

type Props = {
	id?: number;
	onClose: () => void;
};

type FormData = {
	product: number | null;
	stock: number;
	files?: File[];
};

function isProductInfo(p: Item | null): p is Item {
	return !!p; // campos son opcionales, con que exista el objeto basta
}

export default function ModalEdit({ onClose, id }: Props) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
		reset,
	} = useForm<FormData>({
		defaultValues: { product: id || null, stock: 0 },
	});

	const selectedProductId = watch("product");

	const [productInfo, setProductInfo] = useState<Item | null>(null);
	const [loadingProduct, setLoadingProduct] = useState(false);

	useEffect(() => {
		async function fetchProduct(prodId: number) {
			setLoadingProduct(true);
			try {
				type ProductsResponse = { products: paginateResponse<Item> };
				const { data } = await axios.get<ProductsResponse>(route("products"), {
					params: { id: prodId, perPage: 1 },
				});
				setProductInfo(data.products.data[0] ?? null);
			} catch (e) {
				console.error("Error obteniendo producto", e);
				toast.error(
					`Error al obtener producto: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
				);
				setProductInfo(null);
			} finally {
				setLoadingProduct(false);
			}
		}

		if (selectedProductId) {
			fetchProduct(selectedProductId);
		} else {
			setProductInfo(null);
		}
	}, [selectedProductId]);

	useEffect(() => {
		if (!productInfo) reset();
	}, [productInfo, reset]);

	const onSubmit = (data: FormData) => {
		console.log("Submitted data:", data);
		toast.success("Inventario actualizado correctamente");
	};

	return (
		<ModalStyled
			onClose={onClose}
			header={<h2>Inventario {id}</h2>}
			body={
				<form className="gap-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
					<SelectProduct<FormData> control={control} name="product" id={id} />

					<div className="rounded-md border border-gray-200 dark:border-neutral-700 p-3 text-sm flex gap-4 items-start min-h-[88px] max-md:flex-col max-md:items-center">
						{loadingProduct ? (
							<div className="flex gap-3 w-full">
								<div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
								<div className="flex-1 flex flex-col gap-2">
									<div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
									<div className="h-3 w-1/3 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
									<div className="h-3 w-2/5 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
								</div>
							</div>
						) : productInfo ? (
							<>
								<Image
									src={imageUrl(productInfo?.default_image?.image ?? "")}
									alt={productInfo?.name ?? ""}
									style={{ borderRadius: "0.375rem" }}
									width={100}
									height={100}
									className="object-cover rounded border border-gray-200 dark:border-neutral-600"
								/>
								<div className="flex flex-col gap-1 leading-tight">
									<span className="font-semibold text-gray-800text-sm line-clamp-2">
										{productInfo?.name}
									</span>
									{productInfo?.barcode && (
										<span className="text-xs">
											Código: {productInfo.barcode}
										</span>
									)}
									{isProductInfo(productInfo) && productInfo.brand?.name && (
										<span className="text-xs text-gray-600">
											Marca: {productInfo.brand.name}
										</span>
									)}
									<span className="text-xs text-gray-600">
										<b>Descripción:</b> {productInfo?.description}
									</span>
								</div>
							</>
						) : (
							<span className="text-xs text-gray-500 italic">
								Selecciona un producto para ver detalles
							</span>
						)}
					</div>

					<div className="flex items-start gap-3 max-md:flex-col max-md:items-center">
						<TextField
							{...register("stock", {
								required: "Este campo es obligatorio",
								valueAsNumber: true,
								validate: {
									noCero: (v) =>
										(typeof v === "number" && !Number.isNaN(v) && v !== 0) ||
										"No puede ser 0",
									entero: (v) => Number.isInteger(v) || "Solo números enteros",
									noNegativo: (v) =>
										(typeof v === "number" &&
											(productInfo?.product_inventory?.stock ?? 0) +
												Number(v) >=
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
							error={!!errors.stock}
							helperText={errors.stock?.message}
							fullWidth
						/>
						<div className="flex gap-3">
							<div className="flex flex-col items-center min-w-[100px] px-2 py-1 rounded border border-blue-200 bg-blue-50">
								<span className="text-xs text-blue-700 mb-1 font-medium">
									Actual
								</span>
								<span className="text-base font-semibold text-blue-700">
									{productInfo?.product_inventory?.stock ?? 0}
								</span>
							</div>
							<div className="flex flex-col items-center min-w-[100px] px-2 py-1 rounded border border-green-200 bg-green-50">
								<span className="text-xs text-green-700 mb-1 font-medium">
									Después
								</span>
								<span className="text-base font-semibold text-green-700">
									{(productInfo?.product_inventory?.stock ?? 0) +
										(Number(watch("stock")) || 0)}
								</span>
							</div>
						</div>
					</div>
					{productInfo && <FileUpload name="files" control={control} />}
				</form>
			}
			footer={<Button onClick={handleSubmit(onSubmit)}>Guardar</Button>}
		/>
	);
}
