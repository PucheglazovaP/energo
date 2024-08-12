import { Tag, Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';
import { isCloseBracket, isOpenBracket } from '../utils';

function createCaseSectionNode(
	initialToken: Token | null,
	getExpression: () => Node,
	getToken: () => Token | null,
	next: LemmNextFunction,
): Node {
	const caseSectionNode: Node = new Node();
	let token: Token | null = initialToken;
	if (token != null && token.tag === Tag.WHEN) {
		const whenWordNode: Node = new Node();
		whenWordNode.prependLeaf(token);
		token = next();

		if (token == null) return whenWordNode;

		if (isOpenBracket(token)) {
			const openBracketNode: Node = new Node();
			openBracketNode.prependLeaf(token);

			caseSectionNode.prependChild(whenWordNode);
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

					if (token != null && token.tag === Tag.THEN) {
						const thenWordNode: Node = new Node();
						thenWordNode.prependLeaf(token);

						caseSectionNode.prependChild(thenWordNode);

						token = next();

						if (token != null && isOpenBracket(token)) {
							const secondOpenBracketNode: Node = new Node();
							secondOpenBracketNode.prependLeaf(token);

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

									whenThenSectionNode.prependChild(expressionNode);
									whenThenSectionNode.prependChild(commaNode);
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

		caseSectionNode.prependChild(whenWordNode);
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

	if (getToken()?.tag === Tag.END) next();
	caseNode.padding = [10, 0, 10, 0];
	caseNode.type = 'case';
	return caseNode;
}
