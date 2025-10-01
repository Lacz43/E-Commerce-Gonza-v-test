import ModalStyled from "@/Components/Modals/ModalStyled";

type MovementData = {
	id: number;
	quantity: number;
	type: string;
	created_at: string;
	model_type: string;
	product_inventory?: {
		product?: {
			name?: string;
			barcode?: string;
		};
	};
	user?: {
		name?: string;
	};
	attachments?: {
		id: number;
		file_name: string;
	}[];
};

type Props = {
	data: MovementData;
	modelsName?: Record<string, string>;
	onClose: () => void;
};

export default function ModalMovementDetail({ data, modelsName, onClose }: Props) {
	return (
		<ModalStyled
			header={<h3>Detalles del Movimiento</h3>}
			body={
				<div className="space-y-2">
					<p><strong>ID:</strong> {data.id}</p>
					<p><strong>Producto:</strong> {data.product_inventory?.product?.name}</p>
					<p><strong>Código:</strong> {data.product_inventory?.product?.barcode}</p>
					<p><strong>Cantidad:</strong> {data.quantity}</p>
					<p><strong>Tipo:</strong> {data.type === "ingress" ? "Entrada" : "Salida"}</p>
					<p><strong>Usuario:</strong> {data.user?.name}</p>
					<p><strong>Fecha:</strong> {new Date(data.created_at).toLocaleString()}</p>
					<p><strong>Origen:</strong> {modelsName?.[data.model_type.replace("App\\Models\\", "")] || data.model_type}</p>
					{data.attachments && data.attachments.length > 0 && (
						<div>
							<strong>Adjuntos:</strong>
							<ul className="list-disc list-inside">
								{data.attachments.map((attachment) => (
									<li key={attachment.id}>
										<a
											href={route("attachments.downloadInventoryMovementAttachment", attachment.id)}
											className="text-blue-600 hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											{attachment.file_name}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			}
			footer={
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					Cerrar
				</button>
			}
			onClose={onClose}
		/>
	);
}
