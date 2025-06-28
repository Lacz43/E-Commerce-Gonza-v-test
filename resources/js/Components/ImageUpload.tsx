import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { prepareFiles } from "@/utils";

interface ImageUploadProps {
	onImagesSelected?: (images: File[]) => void;
	onMainImageSelected?: (image: number | null) => void;
	setImagesInit?: string[];
	defaultImage?: number;
	appendImages?: File[];
}

const ImageUpload: FC<ImageUploadProps> = ({
	onImagesSelected,
	onMainImageSelected,
	defaultImage,
	setImagesInit,
	appendImages,
}) => {
	const [images, setImages] = useState<File[]>([]);
	const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Ref para memorizar el appendImages “anterior”
	const prevAppendRef = useRef<File[]>([]);

	useEffect(() => {
		if (setImagesInit && !images.length) {
			const init = async () => {
				try {
					// Suponiendo que prepareFiles es una función que procesa las imágenes
					const files = await prepareFiles(setImagesInit); // Pasamos setImagesInit directamente
					setImages(files);

					// Establecemos el índice principal si es necesario
					if (defaultImage) {
						setMainImageIndex(defaultImage);
					} else setMainImageIndex(0);
				} catch (error) {
					console.error("Error al inicializar imágenes:", error);
				}
			};

			init();
		}
	}, [setImagesInit]); // Asegúrate de incluir setImagesInit como dependencia

	// Sólo añadir si appendImages cambió (y no es el mismo array vacío, por ejemplo)
	useEffect(() => {
		const prev = prevAppendRef.current;
		const curr = appendImages || [];

		// Comparamos referencias o bien lo que prefieras:
		const isDifferent =
			!prev ||
			prev.length !== curr.length ||
			prev.some((f, i) => f.name !== curr[i]?.name || f.size !== curr[i]?.size);

		if (isDifferent && curr.length > 0) {
			setImages((prevState) => [...prevState, ...curr]);
		}

		prevAppendRef.current = curr;
	}, [appendImages]);

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
	}, [images]);

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
		if (onMainImageSelected && index) {
			onMainImageSelected(index);
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

			const prev = prevAppendRef.current;
			prevAppendRef.current = prev.filter((i) => images[index] !== i);
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
							<div
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
