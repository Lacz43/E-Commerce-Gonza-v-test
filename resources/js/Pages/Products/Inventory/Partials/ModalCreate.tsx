import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useModal } from "@/Context/Modal";
import CreateForm from "@/Pages/Products/Partials/Form";
import ProductSelector from "./ProductSelector";
import QuantityInput from "./QuantityInput";
import { router } from "@inertiajs/react";

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

export default function ModalCreate({ onClose }: Props) {
	const methods = useForm<FormData>({
		defaultValues: { items: [{ product: null, stock: 0 }] },
	});
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = methods;

	const { openModal } = useModal();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const watchedProducts = useWatch({
		name: fields.map((_, i) => `items.${i}.product`) as readonly `items.${number}.product`[],
		control,
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
		fields.forEach((_field, index) => {
			const productId = watchedProducts[index];
			if (
				productId &&
				(!productInfos[index] || productInfos[index]?.id !== productId)
			) {
				fetchProduct(productId, index);
			}
			else if (!productId && productInfos[index] !== null) {
				setProductInfos((prev) => {
					const newInfos = [...prev];
					newInfos[index] = null;
					return newInfos;
				});
			}
		});
	}, [watchedProducts, fields, fetchProduct]);

	const onSubmit = async (data: FormData) => {
		console.log("Submitted data:", data);
		try {
			await axios.post(route("inventory.store"), data);
			toast.success("Inventario creado correctamente");
			reset();
			onClose();
			router.reload();
		} catch (e) {
			console.error("Error creando inventario", e);
			toast.error(
				`Error al crear inventario: ${e instanceof AxiosError ? e.message : "Error desconocido"}`,
			);
		}
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
							<div
								key={field.id}
								className="py-2 px-4 border-b border-gray-100 last:border-b-0"
							>
								<div className="flex gap-4 items-end">
									<div className="flex-1">
										<ProductSelector<FormData>
											name={`items.${index}.product`}
										/>
									</div>
									<div className="flex-[2]">
										<QuantityInput
											productInfo={productInfos[index]}
											name={`items.${index}.stock`}
										/>
									</div>
									{fields.length > 1 && (
										<div className="self-center">
											<Tooltip title="Eliminar producto">
												<IconButton
													color="error"
													size="small"
													onClick={() => remove(index)}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</div>
									)}
								</div>
							</div>
						))}
						<div className="flex gap-2">
							<Button variant="contained" onClick={addItem}>
								Añadir Producto
							</Button>
							<Tooltip title="Crear nuevo producto">
								<Button
									variant="outlined"
									color="primary"
									onClick={() =>
										openModal(() => <CreateForm onSubmit={() => {}} />)
									}
								>
									<AddIcon />
								</Button>
							</Tooltip>
						</div>

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
			footer={<Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Crear</Button>}
		/>
	);
}
