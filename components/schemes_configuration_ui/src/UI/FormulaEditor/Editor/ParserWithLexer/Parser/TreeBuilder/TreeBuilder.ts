import Lexer from '../Lexer';
import { Tag, Token } from '../Lexer/types';
import Node from '../Node';

import {
	createBracket,
	createCase,
	createCustomFunction,
	createExpression,
	createFunction,
	createPower,
	createSquare,
	createSquareRoot,
} from './lemms';
import { LemmNextFunction } from './types';
import {
	isCloseBracket,
	isComma,
	isCustomFunction,
	isFunction,
	isLt,
	isOpenBracket,
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
			if (isCloseBracket(this.#currentToken) || isComma(this.#currentToken)) {
				break;
			}

			if (isOpenBracket(this.#currentToken)) {
				root.prependChild(this.#createLemme(createBracket));
				continue;
			}

			if (this.#currentToken.tag === Tag.CASE) {
				root.prependChild(this.#createLemme(createCase));
				continue;
			}

			if (this.#currentToken.tag === Tag.SQUARE) {
				root.prependChild(this.#createLemme(createSquare));
				continue;
			}

			if (this.#currentToken.tag === Tag.POWER) {
				root.prependChild(this.#createLemme(createPower));
				continue;
			}

			if (isLt(this.#currentToken)) {
				const ltSignNode: Node = new Node();
				ltSignNode.prependLeaf(this.#currentToken);
				this.#nextToken();
				if (
					this.#currentToken != null &&
					isCustomFunction(this.#currentToken)
				) {
					root.prependChild(this.#createLemme(createCustomFunction));
					continue;
				}
				root.prependChild(ltSignNode);
				continue;
			}

			if (isFunction(this.#currentToken)) {
				root.prependChild(this.#createLemme(createFunction));
				continue;
			}

			if (this.#currentToken.tag === Tag.SQRT) {
				root.prependChild(this.#createLemme(createSquareRoot));
				continue;
			}

			root.prependChild(
				createExpression(this.#currentToken, this.#next.bind(this)),
			);
		}
		return root;
	}
}
