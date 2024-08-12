import { Tag, Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { createEmptyNode, isCloseBracket, isOpenBracket } from '../utils';

function createCaseSectionNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const caseSectionNode: Node = new Node();
	let token: Token | null = initialToken;

	const preparedWhenNode: Node = new Node();
	if (token != null) {
		preparedWhenNode.prependLeaf(token);
	}
	caseSectionNode.prependChild(preparedWhenNode);

	if (token != null && token.tag === Tag.WHEN) {
		token = next();

		if (token == null) return caseSectionNode;

		if (isOpenBracket(token)) {
			const openBracketNode: Node = new Node();
			const openBracketToken: Token = token;
			openBracketNode.prependLeaf(openBracketToken);

			caseSectionNode.prependChild(openBracketNode);

			token = next();

			if (token != null) {
				const conditionNode: Node = new Node();
				conditionNode.prependChild(getExpression());

				caseSectionNode.prependChild(conditionNode);

				token = getToken();

				if (token != null && isCloseBracket(token)) {
					const closeBracketNode: Node = new Node();
					closeBracketNode.prependLeaf(token);

					caseSectionNode.prependChild(closeBracketNode);

					token = next();

					const preparedThenNode: Node = new Node();
					if (token != null) {
						preparedThenNode.prependLeaf(token);
						caseSectionNode.prependChild(preparedThenNode);
					}

					if (token != null && token.tag === Tag.THEN) {
						token = next();

						if (token != null && isOpenBracket(token)) {
							const secondOpenBracketNode: Node = new Node();
							const secondOpenBracketToken: Token = token;
							secondOpenBracketNode.prependLeaf(secondOpenBracketToken);

							caseSectionNode.prependChild(secondOpenBracketNode);

							token = next();

							if (token != null) {
								const expressionNode: Node = new Node();
								expressionNode.prependChild(getExpression());
								token = getToken();

								if (token != null && isCloseBracket(token)) {
									const whenThenSectionNode: Node = new Node();
									const commaToken: Token = new Token(','.charCodeAt(0));
									const commaNode: Node = new Node();
									commaNode.prependLeaf(commaToken);
									commaNode.padding = [5, 0, 0, 0];

									const expressionEmptyNode: Node = createEmptyNode(
										secondOpenBracketToken,
										true,
									);

									const conditionEmptyNode: Node = createEmptyNode(
										openBracketToken,
										true,
									);

									whenThenSectionNode.prependChild(expressionEmptyNode);

									whenThenSectionNode.prependChild(expressionNode);
									whenThenSectionNode.prependChild(commaNode);
									whenThenSectionNode.prependChild(conditionEmptyNode);
									whenThenSectionNode.prependChild(conditionNode);

									return whenThenSectionNode;
								}

								caseSectionNode.prependChild(expressionNode);
							}
						}
					}
				}
			}

			return caseSectionNode;
		}

		caseSectionNode.prependChild(preparedWhenNode);
		caseSectionNode.prependChild(getExpression());
	}
	return caseSectionNode;
}

export default function createCaseNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const caseNode: Node = new Node();
	caseNode.flow = 'vertical';

	let token: Token | null = initialToken;

	token = next();

	while (token != null && token.tag !== Tag.END) {
		caseNode.prependChild(
			createCaseSectionNode(token, getExpression, getToken, next),
		);
		token = next();
	}

	caseNode.padding = [10, 0, 10, 10];
	caseNode.type = 'case';

	return caseNode;
}
