import { router } from "@inertiajs/react";
import { Button, TextField } from "@mui/material";
import axios, { type AxiosError } from "axios";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";

export type ModalType = {
	type: "create" | "edit";
	id?: number;
};

type Props = {
	openModal: ModalType | null;
	name: string;
	onClose: () => void;
};

type FormStruture = {
	name: string;
};

export default function Modal({ openModal, name, onClose }: Props) {
	const id = useId();
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	useEffect(() => {
		if (openModal?.id) {
			setValue("name", name);
		}
	}, [openModal?.id, name, setValue]);

	const path = () => {
		if (openModal?.type === "create") {
			return { url: route("products.brands.store"), method: "post" };
		} else if (openModal?.type === "edit") {
			return {
				url: route("products.brands.update", openModal?.id),
				method: "put",
			};
		}
		return null;
	};

	const onSubmit = async (data: FormStruture) => {
		try {
			const r = path();
			if (!r) return;

			const response = await axios({
				url: r.url,
				method: r.method,
				data: data,
			});

			onClose();
			reset();
			router.reload({ showProgress: true });
			toast.success(response.data.message);
		} catch (e) {
			console.log(e);
			const error = e as AxiosError<{ message: string }>;
			toast.error(
				`Error al ${openModal?.type === "create" ? "Nueva" : "Editar"}: ${error.response?.data?.message || "Error desconocido"}`,
			);
		}
	};

	return (
		<ModalStyled
			onClose={() => onClose()}
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					{openModal?.type === "create" ? "Nueva" : "Editar"} Marca
				</h2>
			}
			body={
				<div className="p-6 text-gray-900">
					<TextField
						className="w-full"
						id={`${id}-product_brand_name`}
						label="Nombre"
						error={!!errors.name}
						variant="filled"
						required
						{...register("name", {
							required: "Este campo es obligatorio",
						})}
						helperText={errors.name?.message}
					/>
				</div>
			}
			footer={
				<div className="flex justify-end gap-2">
					<Button onClick={() => onClose()} color="info" variant="contained">
						<b>Cancelar</b>
					</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						type="submit"
						color="success"
						variant="contained"
						loading={isSubmitting}
					>
						<b>Guardar</b>
					</Button>
				</div>
			}
		/>
	);
}
