import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isComma, isOpenBracket } from '../utils';

export default function createPowerNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const powerNode: Node = new Node();
	const operatorNode: Node = new Node();
	let currentToken: Token | null = initialToken;

	if (currentToken != null) {
		operatorNode.prependLeaf(currentToken);
		powerNode.prependChild(operatorNode);
	}

	currentToken = next();

	if (currentToken != null && isOpenBracket(currentToken)) {
		const openBracketNode: Node = new Node();
		openBracketNode.prependLeaf(currentToken);

		powerNode.prependChild(openBracketNode);

		currentToken = next();

		if (currentToken != null) {
			const expressionNode: Node = getExpression();
			powerNode.prependChild(expressionNode);

			currentToken = getToken();

			if (currentToken != null && isComma(currentToken)) {
				const commaNode: Node = new Node();
				commaNode.prependLeaf(currentToken);
				powerNode.prependChild(commaNode);

				currentToken = next();

				if (currentToken != null) {
					const powerExpressionNode: Node = getExpression();
					powerNode.prependChild(powerExpressionNode);

					currentToken = getToken();

					if (currentToken != null && isCloseBracket(currentToken)) {
						const closeBracketNode: Node = new Node();
						closeBracketNode.prependLeaf(currentToken);

						next();

						const finalPowerNode: Node = new Node();
						finalPowerNode.prependChild(openBracketNode);
						finalPowerNode.prependChild(expressionNode);
						finalPowerNode.prependChild(closeBracketNode);
						powerExpressionNode.fontSize = 0.5;
						powerExpressionNode.padding = [0, 0, 0, 10];
						finalPowerNode.prependChild(powerExpressionNode);

						return finalPowerNode;
					}
				}
			}
		}
	}

	return powerNode;
}
