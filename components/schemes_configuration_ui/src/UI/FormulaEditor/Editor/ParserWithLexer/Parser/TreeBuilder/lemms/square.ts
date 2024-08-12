import { Num, Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isOpenBracket } from '../utils';

export default function createSquareNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const squareNode: Node = new Node();
	const operatorNode: Node = new Node();
	let token: Token | null = initialToken;

	if (token != null) {
		operatorNode.prependLeaf(token);
		squareNode.prependChild(operatorNode);
	}

	token = next();

	if (token != null && isOpenBracket(token)) {
		const openBracketNode: Node = new Node();
		openBracketNode.prependLeaf(token);
		squareNode.prependChild(openBracketNode);

		token = next();

		if (token != null) {
			const expression: Node = getExpression();
			squareNode.prependChild(expression);

			token = getToken();

			if (token != null && isCloseBracket(token)) {
				const closeBracketNode: Node = new Node();
				closeBracketNode.prependLeaf(token);
				const squareSignNode: Node = new Node();
				squareSignNode.prependLeaf(new Num(2));

				const preparedSquareNode: Node = new Node();
				preparedSquareNode.prependChild(openBracketNode);
				preparedSquareNode.prependChild(expression);
				preparedSquareNode.prependChild(closeBracketNode);
				squareSignNode.fontSize = 0.5;
				squareSignNode.padding = [0, 0, 0, 10];
				preparedSquareNode.prependChild(squareSignNode);

				next();

				return preparedSquareNode;
			}
		}
	}

	return squareNode;
}
