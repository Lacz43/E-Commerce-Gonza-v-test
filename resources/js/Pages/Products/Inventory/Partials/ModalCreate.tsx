import { Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import Image from "@/Components/Image";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { imageUrl } from "@/utils";
import ProductSelector from "./ProductSelector";
import QuantityInput from "./QuantityInput";

type Props = {
	onClose: () => void;
};

type ItemData = {
	product: number | null;
	stock: number;
};

type FormData = {
	items: ItemData[];
	reason?: string;
	files?: File[];
};

function isProductInfo(p: Item | null): p is Item {
	return !!p; // campos son opcionales, con que exista el objeto basta
}

export default function ModalCreate({ onClose }: Props) {
	const methods = useForm<FormData>({
		defaultValues: { items: [{ product: null, stock: 0 }] },
	});
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const [productInfos, setProductInfos] = useState<(Item | null)[]>([]);
	const [loadingProducts, setLoadingProducts] = useState<boolean[]>([]);

	const fetchProduct = useCallback(async (prodId: number, index: number) => {
		setLoadingProducts((prev) => {
			const newLoading = [...prev];
			newLoading[index] = true;
			return newLoading;
		});
		try {
			type ProductsResponse = { products: paginateResponse<Item> };
			const { data } = await axios.get<ProductsResponse>(route("products"), {
				params: { id: prodId, perPage: 1 },
			});
			setProductInfos((prev) => {
				const newInfos = [...prev];
				newInfos[index] = data.products.data[0] ?? null;
				return newInfos;
			});
		} catch (e) {
			console.error("Error obteniendo producto", e);
			toast.error(
				`Error al obtener producto: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
			);
			setProductInfos((prev) => {
				const newInfos = [...prev];
				newInfos[index] = null;
				return newInfos;
			});
		} finally {
			setLoadingProducts((prev) => {
				const newLoading = [...prev];
				newLoading[index] = false;
				return newLoading;
			});
		}
	}, []);

	useEffect(() => {
		fields.forEach((field, index) => {
			const productId = watch(`items.${index}.product`);
			if (
				productId &&
				(!productInfos[index] || productInfos[index]?.id !== productId)
			) {
				fetchProduct(productId, index);
			}
		});
	}, [fields, watch, productInfos, fetchProduct]);

	const onSubmit = (data: FormData) => {
		console.log("Submitted data:", data);
		toast.success("Inventario creado correctamente");
	};

	const addItem = () => {
		append({ product: null, stock: 0 });
		setProductInfos((prev) => [...prev, null]);
		setLoadingProducts((prev) => [...prev, false]);
	};

	return (
		<ModalStyled
			onClose={onClose}
			header={<h2>Crear Inventario</h2>}
			body={
				<FormProvider {...methods}>
					<form
						className="gap-4 flex flex-col"
						onSubmit={handleSubmit(onSubmit)}
					>
						{fields.map((field, index) => (
							<div key={field.id} className="border p-4 rounded">
								<div className="flex gap-4 items-end">
									<div className="flex-1">
										<ProductSelector<FormData>
											name={`items.${index}.product`}
										/>
									</div>
									<div className="flex-1">
										<QuantityInput
											productInfo={productInfos[index]}
											name={`items.${index}.stock`}
										/>
									</div>
									{fields.length > 1 && (
										<Button
											variant="outlined"
											color="error"
											onClick={() => remove(index)}
										>
											Eliminar
										</Button>
									)}
								</div>
								<div className="rounded-md border border-gray-200 dark:border-neutral-700 p-3 text-sm flex gap-4 items-start min-h-[88px] max-md:flex-col max-md:items-center mt-2">
									{loadingProducts[index] ? (
										<div className="flex gap-3 w-full">
											<div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
											<div className="flex-1 flex flex-col gap-2">
												<div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
												<div className="h-3 w-1/3 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
												<div className="h-3 w-2/5 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
											</div>
										</div>
									) : productInfos[index] ? (
										<>
											<Image
												src={imageUrl(
													productInfos[index]?.default_image?.image ?? "",
												)}
												alt={productInfos[index]?.name ?? ""}
												style={{ borderRadius: "0.375rem" }}
												width={100}
												height={100}
												className="object-cover rounded border border-gray-200 dark:border-neutral-600"
											/>
											<div className="flex flex-col gap-1 leading-tight">
												<span className="font-semibold text-gray-800 text-sm line-clamp-2">
													{productInfos[index]?.name}
												</span>
												{productInfos[index]?.barcode && (
													<span className="text-xs">
														Código: {productInfos[index].barcode}
													</span>
												)}
												{isProductInfo(productInfos[index]) &&
													productInfos[index].brand?.name && (
														<span className="text-xs text-gray-600">
															Marca: {productInfos[index].brand.name}
														</span>
													)}
												<span className="text-xs text-gray-600">
													<b>Descripción:</b> {productInfos[index]?.description}
												</span>
											</div>
										</>
									) : (
										<span className="text-xs text-gray-500 italic">
											Selecciona un producto para ver detalles
										</span>
									)}
								</div>
							</div>
						))}
						<Button variant="contained" onClick={addItem}>
							Añadir Producto
						</Button>

						<TextField
							{...register("reason")}
							label="Razón de ajuste (opcional)"
							type="text"
							multiline
							error={!!errors.reason}
							helperText={errors.reason?.message}
							fullWidth
						/>
						{productInfos.some((p) => p) && <FileUpload name="files" />}
					</form>
				</FormProvider>
			}
			footer={<Button onClick={handleSubmit(onSubmit)}>Crear</Button>}
		/>
	);
}
