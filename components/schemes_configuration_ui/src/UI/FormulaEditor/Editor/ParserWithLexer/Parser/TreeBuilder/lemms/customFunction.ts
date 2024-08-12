import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isComma, isGt, isOpenBracket } from '../utils';

export default function createCustomFunction(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const customFunctionNode: Node = new Node();
	let currentToken: Token | null = initialToken;
	const functionNameNode: Node = new Node();
	if (currentToken != null) {
		functionNameNode.prependLeaf(currentToken);
		customFunctionNode.prependChild(functionNameNode);
	}

	currentToken = next();

	if (currentToken != null && isGt(currentToken)) {
		currentToken = next();

		if (currentToken != null && isOpenBracket(currentToken)) {
			const openBracketNode: Node = new Node();
			openBracketNode.prependLeaf(currentToken);
			customFunctionNode.prependChild(openBracketNode);

			do {
				currentToken = next();
				const expression: Node = getExpression();
				customFunctionNode.prependChild(expression);
				currentToken = getToken();
				if (currentToken != null && isCloseBracket(currentToken)) break;
				if (currentToken != null && isComma(currentToken)) {
					const commaNode: Node = new Node();
					commaNode.prependLeaf(currentToken);
					customFunctionNode.prependChild(commaNode);
				}
			} while (currentToken != null && isComma(currentToken));

			if (currentToken != null && isCloseBracket(currentToken)) {
				const closeBracketNode: Node = new Node();
				closeBracketNode.prependLeaf(currentToken);

				customFunctionNode.prependChild(closeBracketNode);
			}

			next();
		}
	}

	return customFunctionNode;
}
