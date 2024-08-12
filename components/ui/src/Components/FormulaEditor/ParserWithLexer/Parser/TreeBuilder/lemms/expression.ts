import { Tag, Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';

const allowOperators = [
	'+'.charCodeAt(0),
	'-'.charCodeAt(0),
	'*'.charCodeAt(0),
	'/'.charCodeAt(0),
	'>'.charCodeAt(0),
	'<'.charCodeAt(0),
	'='.charCodeAt(0),
];

function isExpressionToken(token: Token): boolean {
	return (
		token.tag === Tag.NUM ||
		token.tag === Tag.GTE ||
		token.tag === Tag.LTE ||
		token.tag === Tag.NOTEQUAL ||
		token.tag === Tag.OR ||
		token.tag === Tag.AND ||
		token.tag === Tag.ID ||
		allowOperators.includes(token.tag)
	);
}

export default function createExpressionNode(
	initialToken: Token | null,
	next: LemmNextFunction,
): Node {
	const expression: Node = new Node();
	let token: Token | null = initialToken;
	while (token != null) {
		if (!isExpressionToken(token)) break;
		expression.prependLeaf(token);
		token = next();
	}
	return expression;
}
