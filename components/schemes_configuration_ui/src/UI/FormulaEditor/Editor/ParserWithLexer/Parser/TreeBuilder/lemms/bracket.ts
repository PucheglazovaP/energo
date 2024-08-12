import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isOpenBracket } from '../utils';

function isDivisionSign(token: Token): boolean {
	return token.tag === '/'.charCodeAt(0);
}

export default function createBracketNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	let token: Token | null = initialToken;
	const bracketNode: Node = new Node();

	if (token == null) return bracketNode;

	const openBracketNode: Node = new Node();
	openBracketNode.prependLeaf(token);
	bracketNode.prependChild(openBracketNode);

	token = next();

	const expression: Node = getExpression();
	token = getToken();
	bracketNode.prependChild(expression);

	if (token != null && isCloseBracket(token)) {
		const closeBracketNode: Node = new Node();
		closeBracketNode.prependLeaf(token);
		bracketNode.prependChild(closeBracketNode);
		token = next();

		if (token != null && isDivisionSign(token)) {
			const divisionSignNode: Node = new Node();
			divisionSignNode.prependLeaf(token);
			bracketNode.prependChild(divisionSignNode);

			token = next();
			if (token != null && isOpenBracket(token)) {
				const secondOpenBracketNode: Node = new Node();
				secondOpenBracketNode.prependLeaf(token);
				bracketNode.prependChild(secondOpenBracketNode);

				token = next();
				const denominatorExpression = getExpression();
				token = getToken();
				bracketNode.prependChild(denominatorExpression);

				if (token != null && isCloseBracket(token)) {
					const fractionNode = new Node();
					fractionNode.flow = 'vertical';
					fractionNode.type = 'fraction';
					fractionNode.prependChild(expression);
					fractionNode.prependChild(denominatorExpression);
					token = next();
					return fractionNode;
				}
			}
		}
	}

	return bracketNode;
}
