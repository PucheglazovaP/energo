import { Tag, Token, Word } from '../Lexer/types';
import Node from '../Node';

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

export function isThen(token: Token): boolean {
	return token.tag === Tag.THEN;
}

export function isEnd(token: Token): boolean {
	return token.tag === Tag.END;
}

export function isCustomFunction(token: Token): boolean {
	const functions: Tag[] = [Tag.FUN_2, Tag.FUN_3];
	return functions.includes(token.tag);
}

export function isFunction(token: Token): boolean {
	const functions: Tag[] = [
		Tag.DATE_PART,
		Tag.FUN_1,
		Tag.FUN_2,
		Tag.FUN_3,
		Tag.TG,
		Tag.COS,
		Tag.SIN,
		Tag.ATG,
		Tag.ACOS,
		Tag.ASIN,
		Tag.SIGN,
		Tag.CHANEL,
		Tag.GROUP,
		Tag.VALUE_START,
		Tag.VALUE_BEFORE,
	];
	return functions.includes(token.tag);
}

export function isArgument(token: Token): boolean {
	const reservedArguments: Tag[] = [
		Tag.HALF,
		Tag.YEAR,
		Tag.MONTH,
		Tag.DAY,
		Tag.WEEK,
		Tag.QUARTER,
		Tag.HOUR,
		Tag.MINUTE,
		Tag.SECOND,
		Tag.WEEK_DAY,
		Tag.DAY_OF_YEAR,
		Tag.START_MONTH,
		Tag.START_DAY,
		Tag.START_SHIFT,
	];
	return reservedArguments.includes(token.tag);
}

export function createEmptyNode(token: Token, isStart: boolean = false): Node {
	const emptyNode: Node = new Node();
	const endTokenOriginIndex: number | undefined =
		token.originEnd != null ? token.originEnd : undefined;
	const endToken: number | undefined =
		endTokenOriginIndex != null
			? endTokenOriginIndex - token.originLength
			: undefined;
	emptyNode.prependLeaf(
		new Word(Tag.EMPTY, '∙', isStart ? endToken : endTokenOriginIndex),
	);
	return emptyNode;
}
