import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isComma, isOpenBracket } from '../utils';

export default function createFunctionNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const functionNode: Node = new Node();

	const functionNameNode: Node = new Node();
	let currentToken: Token | null = initialToken;

	if (currentToken != null) {
		functionNameNode.prependLeaf(currentToken);
		functionNode.prependChild(functionNameNode);
	}

	currentToken = next();

	if (currentToken != null && isOpenBracket(currentToken)) {
		const openBracketNode = new Node();
		openBracketNode.prependLeaf(currentToken);
		functionNode.prependChild(openBracketNode);

		do {
			currentToken = next();

			if (currentToken != null) {
				const expression: Node = getExpression();
				functionNode.prependChild(expression);
				currentToken = getToken();
			}

			if (currentToken != null && isCloseBracket(currentToken)) break;
			if (currentToken != null && isComma(currentToken)) {
				const commaNode: Node = new Node();
				commaNode.prependLeaf(currentToken);
				functionNode.prependChild(commaNode);
			}
		} while (currentToken != null && isComma(currentToken));

		if (currentToken != null && isCloseBracket(currentToken)) {
			const closeBracketNode: Node = new Node();
			closeBracketNode.prependLeaf(currentToken);
			functionNode.prependChild(closeBracketNode);
		}
		next();
	}
	return functionNode;
}
