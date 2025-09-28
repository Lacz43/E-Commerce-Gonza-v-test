import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUpload from "@/Components/FileUpload";
import ModalStyled from "@/Components/Modals/ModalStyled";
import CreateForm from "@/Pages/Products/Partials/Form";
import ProductSelector from "./ProductSelector";
import QuantityInput from "./QuantityInput";
import { useModal } from "@/Context/Modal";

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
		formState: { errors },
		watch,
		reset,
	} = methods;

	const { openModal } = useModal();

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
										<Tooltip title="Eliminar producto">
											<Button
												variant="outlined"
												color="error"
												size="small"
												onClick={() => remove(index)}
											>
												<DeleteIcon />
											</Button>
										</Tooltip>
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
			footer={<Button onClick={handleSubmit(onSubmit)}>Crear</Button>}
		/>
	);
}
