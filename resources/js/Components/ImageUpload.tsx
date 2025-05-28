import { useState, useCallback, type FC, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

interface ImageUploadProps {
	onImagesSelected?: (images: File[]) => void;
	onMainImageSelected?: (image: File) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({
	onImagesSelected,
	onMainImageSelected,
}) => {
	const [images, setImages] = useState<File[]>([]);
	const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setError(null);

			// Validación de archivos
			const validFiles = acceptedFiles.filter((file) => {
				const isValidType = file.type.startsWith("image/");
				const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
				if (!isValidType) {
					setError(`El archivo ${file.name} no es una imagen`);
					return false;
				}
				if (!isValidSize) {
					setError(`El archivo ${file.name} excede el límite de 5MB`);
					return false;
				}
				return true;
			});

			setImages((prev) => [...prev, ...validFiles]);
			if (validFiles.length > 0 && mainImageIndex === null) {
				setMainImageIndex((prev) => (prev === null ? 0 : prev));
			}
		},
		[mainImageIndex],
	);

	useEffect(() => {
		if (onImagesSelected) {
			onImagesSelected(images);
		}
	}, [images, onImagesSelected]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
		},
		maxFiles: 5,
		multiple: true,
	});

	const handleImageSelect = (index: number) => {
		setMainImageIndex(index);
		if (onMainImageSelected && images[index]) {
			onMainImageSelected(images[index]);
		}
	};

	const removeImage = (index: number) => {
		if (images[index]) {
			// Esto borra la imagen y conserva la imagen por defecto
			if (images.length - 1 === mainImageIndex)
				setMainImageIndex(mainImageIndex - 1);
			if (mainImageIndex && index < mainImageIndex)
				setMainImageIndex(mainImageIndex - 1);
			setImages((prev) => prev.filter((i) => images[index] !== i));
		}
	};

	useEffect(() => {
		// setea a null si ya no hay images
		if (images.length <= 0) setMainImageIndex(null);
	}, [images]);

	return (
		<div className="space-y-4">
			{/* Zona de arrastrar y soltar */}
			<div
				{...getRootProps()}
				className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
					isDragActive
						? "border-blue-500 bg-blue-50"
						: "border-gray-300 hover:border-blue-400"
				}`}
			>
				<input {...getInputProps()} />
				<p className="flex flex-col items-center">
					{/* <FaRegImage className="text-4xl text-blue-500 mb-2" /> */}
					<span>Agrega imágenes arrastrándolas aquí</span>
					<span className="text-sm text-gray-500">
						o haz clic para seleccionar
					</span>
				</p>
			</div>

			{/* Mensaje de error */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
					{error}
				</div>
			)}

			{/* Previsualización de imágenes */}
			{images.length > 0 && (
				<div className="">
					{/* Imagen principal */}
					{mainImageIndex !== null && images[mainImageIndex] && (
						<div className="relative">
							<img
								src={URL.createObjectURL(images[mainImageIndex])}
								alt="Principal"
								className="w-full h-48 object-cover rounded border-2 border-yellow-500"
							/>
							<div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
								{/* <FaStar /> */}
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
						{/* Miniaturas */}
						{images.map((image, index) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className={`relative group cursor-pointer ${index === mainImageIndex ? "opacity-50" : ""}`}
								onClick={() => handleImageSelect(index)}
							>
								<div className="absolute right-0 z-200">
									<IconButton
										onClick={(e) => {
											e.stopPropagation();
											removeImage(index);
										}}
									>
										<DeleteIcon className="text-white transition-transform group-hover:scale-105" />
									</IconButton>
								</div>
								<img
									src={URL.createObjectURL(image)}
									alt={`Miniatura ${index}`}
									className="w-full h-48 object-cover rounded border border-gray-300 transition-transform group-hover:scale-105"
								/>
								<div className="absolute bottom-1 right-1 bg-white bg-opacity-75 rounded-full p-1">
									{index + 1}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
