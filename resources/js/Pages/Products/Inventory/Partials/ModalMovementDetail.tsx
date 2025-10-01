import {
	AttachFile,
	Description,
	Image,
	MusicNote,
	PictureAsPdf,
} from "@mui/icons-material";
import { Chip } from "@mui/material";
import ModalStyled from "@/Components/Modals/ModalStyled";

type MovementData = MovementItem & {
	attachments?: Attachment[];
	product_inventory?: ProductInventory;
};

type Props = {
	data: MovementData;
	modelsName?: Record<string, string>;
	onClose: () => void;
};

export default function ModalMovementDetail({
	data,
	modelsName,
	onClose,
}: Props) {
	const getFileIcon = (fileName: string) => {
		const extension = fileName.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "pdf":
				return <PictureAsPdf className="text-red-500" />;
			case "jpg":
			case "jpeg":
			case "png":
			case "gif":
				return <Image className="text-blue-500" />;
			case "mp3":
			case "wav":
				return <MusicNote className="text-green-500" />;
			case "doc":
			case "docx":
			case "xlsx":
			case "xls":
			case "csv":
				return <Description className="text-blue-700" />;
			default:
				return <AttachFile className="text-gray-500" />;
		}
	};

	return (
		<ModalStyled
			header={
				<h3 className="text-lg font-semibold">Detalles del Movimiento</h3>
			}
			body={
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-gray-50 p-3 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-2">
								Información General
							</h4>
							<div className="space-y-1 text-sm">
								<p>
									<span className="font-medium">ID:</span> {data.id}
								</p>
								<div className="flex items-center">
									<span className="font-medium">Tipo:</span>
									<Chip
										label={data.type === "ingress" ? "Entrada" : "Salida"}
										size="small"
										color={data.type === "ingress" ? "success" : "error"}
										className="ml-2"
									/>
								</div>
								<p>
									<span className="font-medium">Cantidad:</span> {data.quantity}
								</p>
								<p>
									<span className="font-medium">Stock Anterior:</span> {data.previous_stock}
								</p>
								<p>
									<span className="font-medium">Stock Actual:</span> {data.product_inventory?.stock}
								</p>
								<p>
									<span className="font-medium">Fecha:</span>{" "}
									{new Date(data.created_at).toLocaleString()}
								</p>
							</div>
						</div>

						<div className="bg-gray-50 p-3 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-2">Producto</h4>
							<div className="space-y-1 text-sm">
								<p>
									<span className="font-medium">Nombre:</span>{" "}
									{data.product_inventory?.product?.name || "N/A"}
								</p>
								<p>
									<span className="font-medium">Código:</span>{" "}
									{data.product_inventory?.product?.barcode || "N/A"}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 p-3 rounded-lg">
						<h4 className="font-medium text-gray-700 mb-2">Usuario y Origen</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<p>
								<span className="font-medium">Usuario:</span>{" "}
								{data.user?.name || "N/A"}
							</p>
							<p>
								<span className="font-medium">Origen:</span>{" "}
								{modelsName?.[data.model_type.replace("App\\Models\\", "")] ||
									data.model_type}
							</p>
						</div>
					</div>

					{data.attachments && data.attachments.length > 0 && (
						<div className="bg-gray-50 p-3 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-3">Adjuntos</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{data.attachments.map((attachment) => (
									<a
										key={attachment.id}
										href={route(
											"attachments.downloadInventoryMovementAttachment",
											attachment.id,
										)}
										className="flex items-center p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
										target="_blank"
										rel="noopener noreferrer"
									>
										{getFileIcon(attachment.file_name)}
										<span className="ml-2 text-sm text-gray-700 truncate">
											{attachment.file_name}
										</span>
									</a>
								))}
							</div>
						</div>
					)}
				</div>
			}
			footer={
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
				>
					Cerrar
				</button>
			}
			onClose={onClose}
		/>
	);
}
