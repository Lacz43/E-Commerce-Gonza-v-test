import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

interface ImageUploadProps<T extends FieldValues> {
	name: Path<T>;
}

function ImageUpload<T extends FieldValues>({ name }: ImageUploadProps<T>) {
	const { control, getValues, setValue } = useFormContext();

	const [dragActive, setDragActive] = useState(false);
	const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

	useEffect(() => {
		const imageUsed = getValues("image_used");
		if (imageUsed !== undefined) setMainImageIndex(imageUsed);
	}, [getValues("images")]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value = [], onChange }, fieldState: { error } }) => {
				const handleImageSelect = (index: number) => {
					setMainImageIndex(index);
					setValue("image_used", index);
				};

				const handleDrop = (acceptedFiles: File[]) => {
					const validFiles = acceptedFiles.filter((file) => {
						const isValidType = file.type.startsWith("image/");
						const isValidSize = file.size <= 5 * 1024 * 1024;
						return isValidType && isValidSize;
					});
					onChange([...value, ...validFiles]);
				};
				const { getRootProps, getInputProps, isDragActive } = useDropzone({
					onDrop: handleDrop,
					accept: { "image/*": [] },
					maxFiles: 10,
					multiple: true,
					onDragEnter: () => setDragActive(true),
					onDragLeave: () => setDragActive(false),
				});
				const removeImage = (index: number) => {
					const newImages = value.filter((_: File, i: number) => i !== index);
					onChange(newImages);
				};
				return (
					<div className="space-y-4">
						<div
							{...getRootProps()}
							className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
								isDragActive || dragActive
									? "border-blue-500 bg-blue-50"
									: "border-gray-300 hover:border-blue-400"
							}`}
						>
							<input {...getInputProps()} />
							<p className="flex flex-col items-center">
								<span>Agrega imágenes arrastrándolas aquí</span>
								<span className="text-sm text-gray-500">
									o haz clic para seleccionar
								</span>
							</p>
						</div>
						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
								{error.message}
							</div>
						)}
						{mainImageIndex !== null && value[mainImageIndex] && (
							<div className="relative">
								<img
									src={URL.createObjectURL(value[mainImageIndex])}
									alt="Principal"
									className="w-full h-48 object-cover rounded border-2 border-yellow-500"
								/>
								<div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
									{/* <FaStar /> */}
								</div>
							</div>
						)}

						{/* Miniaturas */}
						{value.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
								{value.map((image: File, index: number) => (
									<div
										key={image.name + image.size}
										className="relative group cursor-pointer"
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
											src={
												image instanceof File ? URL.createObjectURL(image) : ""
											}
											alt={`Miniatura ${index}`}
											className={`w-full h-48 object-cover rounded border border-gray-300 transition-transform group-hover:scale-105 ${index === mainImageIndex ? "opacity-50" : ""}`}
										/>
										<div className="absolute bottom-1 right-1 bg-white bg-opacity-75 rounded-full p-1">
											{index + 1}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				);
			}}
		/>
	);
}

export default ImageUpload;
