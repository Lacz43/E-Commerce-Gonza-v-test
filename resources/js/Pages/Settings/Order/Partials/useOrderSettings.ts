import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type OrderSettings = {
	max_payment_wait_time_hours: number | null;
	max_guest_orders_per_hour: number;
	max_guest_order_amount: number | null;
	max_guest_order_items: number | null;
};

export function useOrderSettings(initialSettings: OrderSettings) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<OrderSettings>({
		defaultValues: initialSettings,
		mode: "onChange",
	});

	const onSubmit = async (data: OrderSettings) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post(route("settings.order.update"), data);
			toast.success(
				response.data.message || "Configuración actualizada correctamente",
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(
					error.response?.data?.message ||
						"Error al actualizar la configuración",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		control,
		handleSubmit: handleSubmit(onSubmit),
		errors,
		isSubmitting,
	};
}
