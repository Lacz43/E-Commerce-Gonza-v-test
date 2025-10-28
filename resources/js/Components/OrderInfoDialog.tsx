import { ShoppingCart } from "@mui/icons-material";
import ModalStyled from "@/Components/Modals/ModalStyled";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import { useOrderSettings } from "@/Hook/useOrderSettings";

type Props = {
	orderDetails: { id: string; amount: number } | null;
	onClose: () => void;
};

export default function OrderInfoDialog({ orderDetails, onClose }: Props) {
	const { settings } = useGeneralSettings();
	const { settings: orderSettings } = useOrderSettings();

	if (!orderDetails) return null;

	return (
		<ModalStyled
			onClose={onClose}
			header={
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
						<ShoppingCart className="text-white" fontSize="medium" />
					</div>
					<div>
						<h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-100 to-blue-200 bg-clip-text text-transparent">
							Información de la Orden
						</h2>
						<p className="text-sm text-slate-100 font-medium">
							ID: {orderDetails.id}
						</p>
					</div>
				</div>
			}
			body={
				<div className="space-y-4">
					<div className="text-center">
						<p className="text-lg font-semibold text-slate-700 mb-2">
							ID de Orden
						</p>
						<p className="text-2xl font-bold bg-gradient-to-r text-green-700 bg-clip-text mb-4">
							{orderDetails.id}
						</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-semibold text-slate-700 mb-2">
							Monto Total
						</p>
						<p className="text-3xl font-black bg-gradient-to-r bg-clip-text text-green-700">
							{settings.currency === "VES" ? "Bs " : "$ "}
							{orderDetails.amount.toFixed(2)}
						</p>
					</div>
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<p className="text-sm text-yellow-800 font-medium">
							Tiempo restante para realizar el pago:{" "}
							{orderSettings.max_payment_wait_time_hours} horas
						</p>
					</div>
				</div>
			}
			footer={
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
					>
						Cerrar
					</button>
				</div>
			}
		/>
	);
}
