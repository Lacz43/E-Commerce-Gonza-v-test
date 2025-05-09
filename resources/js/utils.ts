import { format } from "date-fns";

export const imageUrl = (file: string): string => {
    // verificar si es una url valida
	try {
		new URL(file);
		return file;
	} catch (e) {
		return "nome";
		//falta ruta local
	}
};

export const formatDate = (date: string): string => {
    const dateF = new Date(date);
    return format(dateF, "dd/MM/yyyy HH:mm:ss");
}
