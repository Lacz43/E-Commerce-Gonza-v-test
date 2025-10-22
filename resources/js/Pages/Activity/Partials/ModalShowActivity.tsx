import { History } from "@mui/icons-material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalStyled from "@/Components/Modals/ModalStyled";

type ModalShowActivityProps = {
	closeModal: () => void;
	activityId: number;
};

type ActivityDetail = {
	id: number;
	description: string;
	event: string;
	causer?: {
		name: string;
	};
	subject_type?: string;
	properties?: Record<string, unknown>;
	changes?: Record<string, unknown>;
	created_at: string;
};

const ModalShowActivity: React.FC<ModalShowActivityProps> = ({
	closeModal,
	activityId,
}) => {
	const [activity, setActivity] = useState<ActivityDetail | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchActivityDetails = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(route("activities.show", activityId));
			setActivity(response.data);
		} catch (error) {
			console.error("Error fetching activity details:", error);
			toast.error("Error al cargar los detalles de la actividad");
			closeModal();
		} finally {
			setLoading(false);
		}
	}, [activityId, closeModal]);

	useEffect(() => {
		fetchActivityDetails();
	}, [fetchActivityDetails]);

	if (loading) {
		return (
			<ModalStyled
				header={
					<h2 className="text-lg font-semibold">Cargando actividad...</h2>
				}
				body={
					<div className="max-w-4xl mx-auto">
						<div className="space-y-6">
							<div className="space-y-2">
								<div className="h-6 bg-gray-200 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
							<div className="space-y-3">
								<div className="h-4 bg-gray-200 rounded"></div>
								<div className="h-4 bg-gray-200 rounded"></div>
								<div className="h-4 bg-gray-200 rounded"></div>
							</div>
						</div>
					</div>
				}
				footer={
					<Button onClick={closeModal} variant="outlined">
						Cerrar
					</Button>
				}
				onClose={closeModal}
			/>
		);
	}

	if (!activity) {
		return (
			<ModalStyled
				header={
					<h2 className="text-lg font-semibold">Actividad no encontrada</h2>
				}
				body={
					<div className="max-w-4xl mx-auto text-center py-8">
						<div className="text-gray-400 mb-4">
							<History className="w-16 h-16 mx-auto" />
						</div>
						<p className="text-gray-600">
							No se pudo cargar la información de la actividad.
						</p>
					</div>
				}
				footer={
					<Button onClick={closeModal} variant="outlined">
						Cerrar
					</Button>
				}
				onClose={closeModal}
			/>
		);
	}

	return (
		<ModalStyled
			header={
				<h2 className="text-2xl font-extrabold bg-clip-text">
					Detalles de Actividad - {activity.event}
				</h2>
			}
			body={
				<div className="max-w-4xl mx-auto">
					<div className="space-y-6">
						{/* Basic Info */}
						<div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
							<h3 className="text-lg font-bold text-slate-800 mb-4">
								Información General
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-semibold text-slate-600">ID</p>
									<p className="text-slate-800">{activity.id}</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-slate-600">Evento</p>
									<p className="text-slate-800">{activity.event}</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-slate-600">
										Usuario
									</p>
									<p className="text-slate-800">
										{activity.causer?.name ?? "Sistema"}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-slate-600">Módulo</p>
									<p className="text-slate-800">
										{activity.subject_type ?? "N/A"}
									</p>
								</div>
								<div className="md:col-span-2">
									<p className="text-sm font-semibold text-slate-600">Fecha</p>
									<p className="text-slate-800">
										{new Date(activity.created_at).toLocaleDateString("es-ES", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</p>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="border-t-2 border-slate-100 pt-6">
							<h4 className="text-base font-bold text-slate-700 mb-3">
								Descripción
							</h4>
							<div className="bg-white border border-gray-200 rounded-lg p-4">
								<p className="text-slate-700 leading-relaxed">
									{activity.description}
								</p>
							</div>
						</div>

						{/* Changes */}
						{activity.changes && Object.keys(activity.changes).length > 0 && (
							<div className="border-t-2 border-slate-100 pt-6">
								<h4 className="text-base font-bold text-slate-700 mb-3">
									Cambios Realizados
								</h4>
								<div className="bg-white border border-gray-200 rounded-lg p-4">
									<pre className="text-sm text-slate-700 whitespace-pre-wrap">
										{JSON.stringify(activity.changes, null, 2)}
									</pre>
								</div>
							</div>
						)}

						{/* Properties */}
						{activity.properties &&
							Object.keys(activity.properties).length > 0 && (
								<div className="border-t-2 border-slate-100 pt-6">
									<h4 className="text-base font-bold text-slate-700 mb-3">
										Propiedades Adicionales
									</h4>
									<div className="bg-white border border-gray-200 rounded-lg p-4">
										<pre className="text-sm text-slate-700 whitespace-pre-wrap">
											{JSON.stringify(activity.properties, null, 2)}
										</pre>
									</div>
								</div>
							)}
					</div>
				</div>
			}
			footer={
				<Button
					onClick={closeModal}
					variant="outlined"
					className="w-full sm:w-auto"
				>
					Cerrar
				</Button>
			}
			onClose={closeModal}
		/>
	);
};

export default ModalShowActivity;
