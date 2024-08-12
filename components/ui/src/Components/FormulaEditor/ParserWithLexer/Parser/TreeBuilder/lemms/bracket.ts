import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { createEmptyNode, isCloseBracket, isOpenBracket } from '../utils';

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
	const openBracketToken: Token = token;
	openBracketNode.prependLeaf(openBracketToken);
	bracketNode.prependChild(openBracketNode);

	token = next();

	const expression: Node = getExpression();
	token = getToken();
	bracketNode.prependChild(expression);

	if (token != null && isCloseBracket(token)) {
		const closeBracketNode: Node = new Node();
		const closeBracketToken: Token = token;
		closeBracketToken.originLength =
			Number(closeBracketToken.originEnd) - Number(openBracketToken.originEnd);
		closeBracketNode.prependLeaf(closeBracketToken);
		bracketNode.prependChild(closeBracketNode);
		token = next();

		if (token != null && isDivisionSign(token)) {
			const divisionSignNode: Node = new Node();
			divisionSignNode.prependLeaf(token);
			bracketNode.prependChild(divisionSignNode);

			token = next();
			if (token != null && isOpenBracket(token)) {
				const secondOpenBracketNode: Node = new Node();
				const secondOpenBracketToken: Token = token;
				secondOpenBracketNode.prependLeaf(secondOpenBracketToken);
				bracketNode.prependChild(secondOpenBracketNode);

				token = next();
				const denominatorExpression = getExpression();
				token = getToken();
				bracketNode.prependChild(denominatorExpression);

				if (token != null && isCloseBracket(token)) {
					const fractionNode = new Node();
					fractionNode.flow = 'vertical';
					fractionNode.type = 'fraction';
					expression.appendChild(createEmptyNode(openBracketToken, true));
					fractionNode.prependChild(expression);
					denominatorExpression.appendChild(
						createEmptyNode(secondOpenBracketToken, true),
					);
					denominatorExpression.padding = [0, 5, 0, 0];
					fractionNode.prependChild(denominatorExpression);

					return fractionNode;
				}
			}
		}
	}

	return bracketNode;
}
