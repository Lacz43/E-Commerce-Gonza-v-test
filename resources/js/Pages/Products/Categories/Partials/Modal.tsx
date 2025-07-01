import { router } from "@inertiajs/react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalStyled from "@/Components/Modals/ModalStyled";

export type ModalType = {
	type: "create" | "edit";
	name?: string;
	id?: number;
};

type Props = {
	openModal: ModalType | null;
	setOpenModal: React.Dispatch<React.SetStateAction<ModalType | null>>;
};

type FormStruture = {
	name: string;
};

export default function Modal({ openModal, setOpenModal }: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormStruture>();

	useEffect(() => {
		if (openModal?.id) {
			setValue("name", openModal?.name ?? "");
		}
        if(openModal == null){
            reset();
        }
	}, [openModal]);

	const onSubmit = async (data: FormStruture) => {
		try {
			await axios.post(route("products.categories.store"), data);
			setOpenModal(null);
			reset();
			router.reload();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ModalStyled
			show={openModal !== null}
			onClose={() => setOpenModal(null)}
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					{openModal?.type === "create" ? "Nuevo" : "Editar"} Categoria
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
					<Button
						onClick={() => setOpenModal(null)}
						color="info"
						variant="contained"
					>
						Cancelar
					</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						type="submit"
						color="success"
						variant="contained"
						loading={isSubmitting}
					>
						Guardar
					</Button>
				</div>
			}
		/>
	);
}
