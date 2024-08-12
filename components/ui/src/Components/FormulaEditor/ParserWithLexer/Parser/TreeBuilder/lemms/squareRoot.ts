import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { createEmptyNode, isCloseBracket, isOpenBracket } from '../utils';

export default function createSquareRootNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const squareRootNode: Node = new Node();
	let currentToken: Token | null = initialToken;
	const sqrtNameNode: Node = new Node();

	if (currentToken != null) {
		sqrtNameNode.prependLeaf(currentToken);
		squareRootNode.prependChild(sqrtNameNode);
	}

	currentToken = next();

	if (currentToken != null && isOpenBracket(currentToken)) {
		const openBracketNode: Node = new Node();
		const openBracketToken: Token = currentToken;
		openBracketNode.prependLeaf(openBracketToken);
		squareRootNode.prependChild(openBracketNode);

		currentToken = next();

		if (currentToken != null) {
			const expressionNode: Node = getExpression();
			squareRootNode.prependChild(expressionNode);
			currentToken = getToken();

			if (currentToken != null && isCloseBracket(currentToken)) {
				const sqrtNode: Node = new Node();
				sqrtNode.type = 'sqrt';
				sqrtNode.padding = [0, 5, 0, 0];
				sqrtNode.prependChild(sqrtNameNode);
				expressionNode.appendChild(createEmptyNode(openBracketToken, true));
				expressionNode.padding = [0, 5, 0, 0];
				sqrtNode.prependChild(expressionNode);

				return sqrtNode;
			}
		}
	}
	return squareRootNode;
}
