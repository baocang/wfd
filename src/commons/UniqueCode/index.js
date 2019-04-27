import {getRandomCode} from "../RandomCode";

export const getUniqueCode = (codes, size = 8) => {
	let code = null;

	do {
		code = getRandomCode(size);
	} while (codes.includes(code));

	return code;
};
