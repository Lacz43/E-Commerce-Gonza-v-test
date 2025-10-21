import { Head } from "@inertiajs/react";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";
import PageHeader from "@/Components/PageHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestOrderAmountCard from "./Partials/GuestOrderAmountCard";
import GuestOrderItemsCard from "./Partials/GuestOrderItemsCard";
import GuestOrdersPerHourCard from "./Partials/GuestOrdersPerHourCard";
import PaymentTimeCard from "./Partials/PaymentTimeCard";
import SubmitButton from "./Partials/SubmitButton";
import {
	type OrderSettings,
	useOrderSettings,
} from "./Partials/useOrderSettings";

type Props = {
	settings: OrderSettings;
};

export default function Index({ settings }: Props) {
	const { control, handleSubmit, errors, isSubmitting } =
		useOrderSettings(settings);

	return (
		<AuthenticatedLayout>
			<Head title="Configuración de Órdenes" />

			<Box sx={{ p: 3 }}>
				<PageHeader
					title="Configuración de Órdenes"
					subtitle="Gestiona los parámetros de tus órdenes"
					icon={SettingsIcon}
					gradientColor="#667eea"
				/>

				<Box component="form" onSubmit={handleSubmit}>
					<Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<PaymentTimeCard
							control={control}
							errors={errors}
							isSubmitting={isSubmitting}
						/>

						<GuestOrdersPerHourCard control={control} errors={errors} />

						<GuestOrderAmountCard control={control} errors={errors} />

						<GuestOrderItemsCard control={control} errors={errors} />
					</Box>
					<SubmitButton isSubmitting={isSubmitting} />
				</Box>
			</Box>
		</AuthenticatedLayout>
	);
}
