export const imageUrl = (file: string): string => {
	try {
		new URL(file);
		return file;
	} catch (e) {
		return "nome";
		//falta ruta local
	}
};
