export function convertColor(color: string) {
	if (color.includes('$')) {
		const a = color.slice(1, 3);
		const hex = color.slice(3);
		if (a !== '00') return `#${hex}${a}`;
		return `#${hex}`;
	}
	if (color.includes('#')) {
		return color;
	}
	return decimalToHex(Number(color), 6);
}

export function decimalToHex(d: number, padding?: number) {
	let hex = Number(d).toString(16).replace('-', '');
	padding = padding || 2;

	return `#${hex.padEnd(padding, '0')}`;
}

export function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}
export function convertHexColor(color: string) {
	const convertedColor = color.slice(1, 7);
	if (color.length > 8) {
		const a = color.slice(7, 9);
		const intA = (Math.round((parseInt(a, 16) / 255) * 100) / 100).toFixed(2);
		return `$${intA.toString().split('.')[1]}${convertedColor}`;
	} else {
		return `$00${convertedColor}`;
	}
}
