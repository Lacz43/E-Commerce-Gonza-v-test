import {
	AttachFile,
	CalendarToday,
	Description,
	Image,
	Info,
	MusicNote,
	Person,
	PictureAsPdf,
	ShoppingBag,
	TrendingDown,
	TrendingUp,
} from "@mui/icons-material";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import ModalStyled from "@/Components/Modals/ModalStyled";

type MovementData = MovementItem & {
	attachments?: Attachment[];
	product_inventory?: ProductInventory;
	reason?: { id: number; name: string; description?: string };
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
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Box>
						<Typography variant="h5" fontWeight={700}>
							Movimiento #{data.id}
						</Typography>
					</Box>
				</Box>
			}
			body={
				<Box>
					{/* Tipo de Movimiento */}
					<Box sx={{ mb: 3, textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary" mb={1}>
							Tipo de Movimiento
						</Typography>
						<Chip
							icon={data.type === "ingress" ? <TrendingUp /> : <TrendingDown />}
							label={data.type === "ingress" ? "Entrada" : "Salida"}
							color={data.type === "ingress" ? "success" : "error"}
							sx={{
								fontWeight: 700,
								fontSize: 14,
								px: 2,
								py: 2.5,
							}}
						/>
					</Box>

					{/* Información del Movimiento */}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 2,
							mb: 3,
						}}
					>
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
								border: "1px solid #93c5fd",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<Info sx={{ color: "#1d4ed8", fontSize: 20 }} />
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									CANTIDAD
								</Typography>
							</Box>
							<Typography variant="h6" fontWeight={700} color="#1d4ed8">
								{data.quantity > 0 ? "+" : ""}
								{data.quantity}
							</Typography>
						</Box>

						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
								border: "1px solid #d8b4fe",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<CalendarToday sx={{ color: "#9333ea", fontSize: 20 }} />
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									FECHA
								</Typography>
							</Box>
							<Typography variant="body1" fontWeight={600}>
								{new Date(data.created_at).toLocaleString()}
							</Typography>
						</Box>

						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
								border: "1px solid #fcd34d",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									STOCK ANTERIOR
								</Typography>
							</Box>
							<Typography variant="h6" fontWeight={700} color="#d97706">
								{data.previous_stock}
							</Typography>
						</Box>

						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
								border: "1px solid #6ee7b7",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									STOCK ACTUAL
								</Typography>
							</Box>
							<Typography variant="h6" fontWeight={700} color="#059669">
								{data.previous_stock + data.quantity}
							</Typography>
						</Box>
					</Box>

					<Divider sx={{ my: 3 }} />

					{/* Información del Producto */}
					<Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
						📦 Producto
					</Typography>
					<Box
						sx={{
							p: 3,
							borderRadius: 2,
							background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
							border: "1px solid #e5e7eb",
							mb: 3,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
							<ShoppingBag sx={{ color: "#059669", fontSize: 24 }} />
							<Typography variant="body1" fontWeight={700}>
								{data.product_inventory?.product?.name || "N/A"}
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary">
							<strong>Código:</strong>{" "}
							{data.product_inventory?.product?.barcode || "N/A"}
						</Typography>
					</Box>

					<Divider sx={{ my: 3 }} />

					{/* Usuario y Origen */}
					<Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
						👤 Usuario y Origen
					</Typography>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 2,
							mb: 3,
						}}
					>
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "#f9fafb",
								border: "1px solid #e5e7eb",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<Person sx={{ color: "#6b7280", fontSize: 20 }} />
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									USUARIO
								</Typography>
							</Box>
							<Typography variant="body1" fontWeight={600}>
								{data.user?.name || "N/A"}
							</Typography>
						</Box>

						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "#f9fafb",
								border: "1px solid #e5e7eb",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={600}
								>
									ORIGEN
								</Typography>
							</Box>
							<Typography variant="body1" fontWeight={600}>
								{modelsName?.[data.model_type.replace("App\\Models\\", "")] ||
									data.model_type}
							</Typography>
						</Box>
					</Box>

					{data.reason && (
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: "#fef3c7",
								border: "1px solid #fcd34d",
								mb: 3,
							}}
						>
							<Typography
								variant="body2"
								fontWeight={600}
								color="#92400e"
								mb={1}
							>
								Razón:
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{data.reason.description}
							</Typography>
						</Box>
					)}

					{/* Adjuntos */}
					{data.attachments && data.attachments.length > 0 && (
						<>
							<Divider sx={{ my: 3 }} />
							<Typography
								variant="h6"
								gutterBottom
								fontWeight={700}
								sx={{ mb: 2 }}
							>
								📎 Adjuntos
							</Typography>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
									gap: 2,
								}}
							>
								{data.attachments.map((attachment) => (
									<Box
										key={attachment.id}
										component="a"
										href={route(
											"attachments.downloadInventoryMovementAttachment",
											attachment.id,
										)}
										target="_blank"
										rel="noopener noreferrer"
										sx={{
											display: "flex",
											alignItems: "center",
											p: 2,
											borderRadius: 2,
											background: "white",
											border: "1px solid #e5e7eb",
											textDecoration: "none",
											transition: "all 0.2s",
											"&:hover": {
												background: "#f9fafb",
												borderColor: "#10b981",
												transform: "translateY(-2px)",
												boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
											},
										}}
									>
										{getFileIcon(attachment.file_name)}
										<Typography
											variant="body2"
											sx={{
												ml: 2,
												color: "text.primary",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{attachment.file_name}
										</Typography>
									</Box>
								))}
							</Box>
						</>
					)}
				</Box>
			}
			footer={
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<Button
						variant="contained"
						color="error"
						onClick={() =>
							window.open(
								route("reports.movements.download", data.id),
								"_blank",
							)
						}
						startIcon={<PictureAsPdf />}
						sx={{
							px: 3,
							py: 1.5,
							borderRadius: 2,
							fontWeight: 600,
							textTransform: "none",
							background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
							"&:hover": {
								background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
							},
						}}
					>
						Descargar PDF
					</Button>
					<Button
						variant="outlined"
						onClick={onClose}
						size="large"
						sx={{
							px: 4,
							py: 1.5,
							borderRadius: 2,
							fontWeight: 600,
							textTransform: "none",
						}}
					>
						Cerrar
					</Button>
				</Box>
			}
			onClose={onClose}
		/>
	);
}
