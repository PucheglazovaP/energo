export function generateRandomColor(forbiddenColors: string[]) {
	let color = '';
	const hexChars = '0123456789ABCDEF';
	while (color === '' || forbiddenColors.includes(color)) {
		color = '#';
		for (let i = 0; i < 6; i++) {
			color += hexChars[Math.floor(Math.random() * 16)];
		}
	}
	return color;
}
