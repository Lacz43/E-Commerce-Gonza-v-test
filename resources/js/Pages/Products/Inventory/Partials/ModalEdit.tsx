import { Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import Image from "@/Components/Image";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { imageUrl } from "@/utils";
import QuantityInput from "./QuantityInput";

type Props = {
	id: number;
	onClose: () => void;
};

type FormData = {
	stock: number;
	reason?: string;
	files?: File[];
};

function isProductInfo(p: Item | null): p is Item {
	return !!p; // campos son opcionales, con que exista el objeto basta
}

export default function ModalEdit({ onClose, id }: Props) {
	const methods = useForm<FormData>({
		defaultValues: { stock: 0 },
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = methods;

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

		fetchProduct(id);
	}, [id]);

	useEffect(() => {
		if (!productInfo) reset();
	}, [productInfo]);

	const onSubmit = (data: FormData) => {
		console.log("Submitted data:", data);
		toast.success("Inventario actualizado correctamente");
	};

	return (
		<ModalStyled
			onClose={onClose}
			header={<h2>Inventario {id}</h2>}
			body={
				<FormProvider {...methods}>
					<form
						className="gap-4 flex flex-col"
						onSubmit={handleSubmit(onSubmit)}
					>

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

						<QuantityInput productInfo={productInfo} />

						<TextField
							{...register("reason")}
							label="Razón de ajuste (opcional)"
							type="text"
							multiline
							error={!!errors.reason}
							helperText={errors.reason?.message}
							fullWidth
						/>
						{productInfo && <FileUpload name="files" />}
					</form>
				</FormProvider>
			}
			footer={<Button onClick={handleSubmit(onSubmit)}>Guardar</Button>}
		/>
	);
}
