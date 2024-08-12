import { Tag, Token } from '../Lexer/types';

export function isOpenBracket(token: Token): boolean {
	return token.tag === '('.charCodeAt(0);
}

export function isCloseBracket(token: Token): boolean {
	return token.tag === ')'.charCodeAt(0);
}

export function isComma(token: Token): boolean {
	return token.tag === ','.charCodeAt(0);
}

export function isLt(token: Token): boolean {
	return token.tag === '<'.charCodeAt(0);
}

export function isGt(token: Token): boolean {
	return token.tag === '>'.charCodeAt(0);
}

export function isCustomFunction(token: Token): boolean {
	const functions: Tag[] = [
		Tag.EMPTY,
		Tag.FUN_1,
		Tag.FUN_2,
		Tag.FUN_3,
		Tag.DATE_PART,
		Tag.VALUE_START,
		Tag.VALUE_BEFORE,
		Tag.DAY_OF_MONTH,
	];
	return functions.includes(token.tag);
}

export function isFunction(token: Token): boolean {
	const functions: Tag[] = [
		Tag.DATE_PART,
		Tag.TG,
		Tag.COS,
		Tag.SIN,
		Tag.ATG,
		Tag.ACOS,
		Tag.ASIN,
		Tag.SIGN,
		Tag.CHANEL,
		Tag.GROUP,
	];
	return functions.includes(token.tag);
}
