import { format } from "date-fns";

export const imageUrl = (file: string): string => {
	// verificar si es una url valida
	try {
		new URL(file);
		return file;
	} catch (e) {
		return `./storage/${file}`;
	}
};

export const formatDate = (date: string): string => {
	const dateF = new Date(date);
	return format(dateF, "dd/MM/yyyy HH:mm:ss");
};

export const isValidEAN13 = (code: string) => {
	if (code.length !== 13) return false;
	const digits = code.split("").map(Number);
	let sumOdd = 0;
	let sumEven = 0;

	for (let i = 0; i < 12; i++) {
		if ((i + 1) % 2 === 1) {
			sumOdd += digits[i]; // Posiciones impares (1, 3, 5...)
		} else {
			sumEven += digits[i]; // Posiciones pares (2, 4, 6...)
		}
	}

	const total = sumOdd + sumEven * 3;
	const checkDigit = (10 - (total % 10)) % 10;
	return checkDigit === digits[12]; // Último dígito es el verificador
};

export const isValidEAN8 = (code: string) => {
	if (code.length !== 8) return false;
	const digits = code.split("").map(Number);
	let sumOdd = 0;
	let sumEven = 0;

	// Suma de posiciones impares y pares (considerando índice 0 como posición 1)
	for (let i = 0; i < 7; i++) {
		if ((i + 1) % 2 === 1) {
			sumOdd += digits[i]; // Posiciones impares (1, 3, 5, 7)
		} else {
			sumEven += digits[i]; // Posiciones pares (2, 4, 6)
		}
	}

	const total = sumOdd + sumEven * 3;
	const checkDigit = (10 - (total % 10)) % 10;
	return checkDigit === digits[7]; // Último dígito es el verificador
};

export const isValidGTIN14 = (code: string) => {
	if (code.length !== 14) return false;
	const digits = code.split("").map(Number);

	let sum = 0;
	for (let i = 0; i < 13; i++) {
		const weight = i % 2 === 0 ? 1 : 3; // Peso alternado: 1, 3, 1, 3...
		sum += digits[i] * weight;
	}

	const checkDigit = (10 - (sum % 10)) % 10;
	return checkDigit === digits[13]; // Último dígito es el verificador
};

export const isValidUPC = (code: string) => {
	if (code.length !== 12) return false;
	const digits = code.split("").map(Number);
	let sumOdd = 0;
	let sumEven = 0;

	for (let i = 0; i < 11; i++) {
		if (i % 2 === 0) {
			sumOdd += digits[i]; // Posiciones impares (0, 2, 4...)
		} else {
			sumEven += digits[i]; // Posiciones pares (1, 3, 5...)
		}
	}

	const total = sumOdd * 3 + sumEven;
	const checkDigit = (10 - (total % 10)) % 10;
	return checkDigit === digits[11]; // Último dígito es el verificador
};
