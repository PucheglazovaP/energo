export function isNumber(value: string): boolean {
	if (value === '' || value === ' ' || value == null) return false;
	return !Number.isNaN(Number(value));
}

export function isDigit(value: string): boolean {
	if (value === '' || value === '' || value == null) return false;
	return !Number.isNaN(Number(value));
}

export function isLetter(value: string): boolean {
	return /^[^!"#$%&'()*+,\-./:;<=>?@[\\\]^`\s\d]$/.test(value);
}

export function isWord(value: string): boolean {
	return /^[a-z_][\w]+$/i.test(value);
}

export function isEmpty(value: string): boolean {
	return value.trim() === '';
}

export function isDot(value: string): boolean {
	return value.trim() === '.';
}

export function isLt(value: string): boolean {
	return value.trim() === '<';
}

export function isGt(value: string): boolean {
	return value.trim() === '>';
}

export function isEqual(value: string): boolean {
	return value.trim() === '=';
}

export function isApostroph(value: string): boolean {
	return value.trim() === "'";
}

export function isSinglQuote(value: string): boolean {
	return value.trim() === "'";
}

export function isDoubleQuote(value: string): boolean {
	return value.trim() === '"';
}
