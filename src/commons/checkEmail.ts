export const checkEmail = (email: string) => {
	const regexp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
	return !!regexp.exec(email);
};
