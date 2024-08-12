import Lexer from '../Lexer';
import { Tag, Token, Word } from '../Lexer/types';
import Node from '../Node';

import {
	createArgument,
	createBracket,
	createCase,
	createExpression,
	createFunction,
	createPower,
	createSquare,
	createSquareRoot,
} from './lemms';
import { LemmNextFunction } from './types';
import {
	isArgument,
	isCloseBracket,
	isComma,
	isEnd,
	isFunction,
	isOpenBracket,
	isThen,
} from './utils';

export default class TreeBuilder {
	#lexer: Lexer;
	#tokens: Generator<Token> | null = null;
	#currentToken: Token | null = null;

	constructor(lexer: Lexer) {
		this.#lexer = lexer;
	}

	build(parsedText: string): Node {
		this.#tokens = this.#lexer.scan(parsedText);
		this.#nextToken();
		const node: Node = this.#build();
		const startToken: Token = new Word(Tag.EMPTY, '', -1);
		const startNode: Node = new Node();
		startNode.prependLeaf(startToken);
		node.appendChild(startNode);
		node.balanse();
		return node;
	}

	#nextToken(): void {
		if (this.#tokens == null) {
			this.#currentToken = null;
			return;
		}

		const cursor: IteratorResult<Token, void> = this.#tokens.next();

		if (cursor.done) {
			this.#currentToken = null;
			return;
		}

		this.#currentToken = cursor.value;
	}

	#next(): Token | null {
		this.#nextToken();
		return this.#currentToken;
	}

	#getToken(): Token | null {
		return this.#currentToken;
	}

	#createLemme(
		lemmsName: (
			initToken: Token | null,
			getExpression: () => Node,
			getToken: () => Token | null,
			next: LemmNextFunction,
		) => Node,
	): Node {
		return lemmsName.call(
			this,
			this.#currentToken,
			this.#build.bind(this),
			this.#getToken.bind(this),
			this.#next.bind(this),
		);
	}

	#build(): Node {
		const root: Node = new Node();
		while (this.#currentToken != null) {
			if (
				isCloseBracket(this.#currentToken) ||
				isComma(this.#currentToken) ||
				isThen(this.#currentToken) ||
				isEnd(this.#currentToken)
			) {
				break;
			}

			if (isOpenBracket(this.#currentToken)) {
				const openBracketIndex: number | undefined =
					this.#getExpressionStartIndex();
				const expression: Node = this.#createLemme(createBracket);
				root.prependChild(expression);

				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(openBracketIndex));
				}

				if (expression.type !== 'fraction' && this.#currentToken != null) {
					continue;
				}

				this.#next();
				continue;
			}

			if (this.#currentToken.tag === Tag.CASE) {
				const caseIndex: number | undefined = this.#getExpressionStartIndex();
				root.prependChild(this.#createLemme(createCase));

				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(caseIndex));
				}

				this.#next();
				continue;
			}

			if (this.#currentToken.tag === Tag.SQUARE) {
				const squareStartIndex: number | undefined =
					this.#getExpressionStartIndex();
				root.prependChild(this.#createLemme(createSquare));
				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(squareStartIndex));
				}
				this.#next();
				continue;
			}

			if (this.#currentToken.tag === Tag.POWER) {
				const powerStartIndex: number | undefined =
					this.#getExpressionStartIndex();
				root.prependChild(this.#createLemme(createPower));
				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(powerStartIndex));
				}
				this.#next();
				continue;
			}

			if (isFunction(this.#currentToken)) {
				const functionStartIndex: number | undefined =
					this.#getExpressionStartIndex();
				root.prependChild(this.#createLemme(createFunction));
				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(functionStartIndex));
				}
				this.#next();
				continue;
			}

			if (this.#currentToken.tag === Tag.SQRT) {
				const startSqrtIndex: number | undefined =
					this.#getExpressionStartIndex();
				root.prependChild(this.#createLemme(createSquareRoot));
				if (this.#currentToken != null) {
					root.prependChild(this.#getExpressionEndNode(startSqrtIndex));
				}
				this.#next();
				continue;
			}

			if (isArgument(this.#currentToken)) {
				root.prependChild(
					createArgument(this.#currentToken, this.#next.bind(this)),
				);
				continue;
			}

			root.prependChild(
				createExpression(this.#currentToken, this.#next.bind(this)),
			);
		}
		return root;
	}

	#getExpressionStartIndex(): number | undefined {
		if (this.#currentToken == null) return undefined;
		const endIndex: number | null = this.#currentToken.originEnd;
		const index: number | undefined =
			endIndex != null
				? endIndex + 1 - this.#currentToken.originLength
				: undefined;
		return index;
	}

	#getExpressionEndNode(startIndex?: number): Node {
		if (startIndex == null || this.#currentToken == null) return new Node();
		const sectionEndIndex: number | null = this.#currentToken.originEnd;
		const caseSectionEnd: number | undefined = sectionEndIndex
			? sectionEndIndex
			: undefined;
		const endEmptyNode: Node = new Node();
		const emptyToken: Word = new Word(Tag.EMPTY, '∙', caseSectionEnd);
		if (caseSectionEnd != null && startIndex != null) {
			emptyToken.originLength = caseSectionEnd - startIndex + 1;
		}

		endEmptyNode.prependLeaf(emptyToken);

		return endEmptyNode;
	}
}
