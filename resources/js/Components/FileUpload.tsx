import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface FileUploadProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
}

const getFileIcon = (file: File) => {
	if (file.type.startsWith("image/"))
		return <ImageIcon className="text-blue-500" fontSize="large" />;
	if (file.type === "application/pdf")
		return <PictureAsPdfIcon className="text-red-500" fontSize="large" />;
	if (file.type.startsWith("text/"))
		return <DescriptionIcon className="text-green-500" fontSize="large" />;
	return <InsertDriveFileIcon className="text-gray-400" fontSize="large" />;
};

function FileUpload<T extends FieldValues>({
	name,
	control,
}: FileUploadProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value = [], onChange }, fieldState: { error } }) => {
				// value es el array de archivos
				const onDrop = (acceptedFiles: File[]) => {
					// Validación de archivos
					const validFiles = acceptedFiles.filter((file) => {
						const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
						return isValidSize;
					});
					onChange([...value, ...validFiles]);
				};

				const { getRootProps, getInputProps, isDragActive } = useDropzone({
					onDrop,
					maxFiles: 10,
					multiple: true,
				});

				const removeFile = (index: number) => {
					const newFiles = value.filter((_: File, i: number) => i !== index);
					onChange(newFiles);
				};

				return (
					<div className="space-y-4">
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
								<span>Agrega archivos arrastrándolos aquí</span>
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

						{/* Lista de archivos */}
						{value.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								{value.map((file: File, index: number) => (
									<div
										key={file.name + file.size}
										className="relative flex items-center gap-4 p-3 border rounded bg-gray-50"
									>
										<div className="flex-shrink-0">{getFileIcon(file)}</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-gray-80 truncate">
												{file.name}
											</div>
											<div className="text-xs text-gray-600">
												{(file.size / 1024).toFixed(1)} KB
											</div>
										</div>
										<IconButton onClick={() => removeFile(index)} size="small">
											<DeleteIcon fontSize="small" />
										</IconButton>
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

export default FileUpload;
