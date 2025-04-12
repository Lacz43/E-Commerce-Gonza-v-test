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
