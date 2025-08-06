import { router } from "@inertiajs/react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
	}, [openModal]);

	const path = () => {
		if (openModal?.type === "create") {
			return { url: route("products.categories.store"), method: "post" };
		} else if (openModal?.type === "edit") {
			return {
				url: route("products.categories.update", openModal?.id),
				method: "patch",
			};
		}
		return null;
	};

	const onSubmit = async (data: FormStruture) => {
		try {
			const r = path();
			if (!r) return;
			await axios(r.url, { method: r.method, data: data });
			onClose();
			reset();
			router.reload({ showProgress: true });
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ModalStyled
			onClose={() => onClose()}
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					{openModal?.type === "create" ? "Nueva" : "Editar"} Categoria
				</h2>
			}
			body={
				<div className="p-6 text-gray-900">
					<TextField
						className="w-full"
						id="product_category_name"
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
