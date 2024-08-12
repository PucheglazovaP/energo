import { formatStringDateToDefault } from '../../../Utils/dateUtils';
import { FormulaChar, ParseResult } from '../types';
import { getMouseInCanvasPosition, replaceCharacter } from '../utils';
import isReserved from '../utils/isReserved';

import Node from './Node';
import reservedWords from './reservedWords';

export default class Parser {
	#text: Generator<string>;
	#lookAtCharacter: string | null = null;
	#lookAtCharacterIndex: number = -1;
	#canvasContext: CanvasRenderingContext2D;

	constructor(
		text: Generator<string>,
		canvasContext: CanvasRenderingContext2D,
	) {
		this.#text = text;
		this.#canvasContext = canvasContext;
	}

	#readCharacter() {
		const cursor: IteratorResult<string, void> = this.#text.next();
		this.#lookAtCharacterIndex += 1;
		if (cursor.done) {
			this.#lookAtCharacter = null;
			return;
		}
		this.#lookAtCharacter = cursor.value;
	}

	scan(): ParseResult {
		this.#readCharacter();
		const mainFragment: Node = this.#getNodes();
		const emptyNode: Node = this.#getEmptyNode(-1);
		mainFragment.appendNode(emptyNode);
		mainFragment.recalculateNodeSize();
		mainFragment.recalculateNodePosition({ x: 10, y: 10 });
		console.log(mainFragment);

		return {
			text: mainFragment.getFormulaText(),
			decorations: mainFragment.getDrawFunctions(),
		};
	}

	/**
	 * Формирует набор узлов формулы, является точкой входа
	 * @returns Набор узлов формулы
	 */
	#getNodes(): Node {
		const node: Node = new Node(this.#canvasContext);
		let operatorName: string = '';
		while (this.#lookAtCharacter != null) {
			if (/[a-z><_=]/i.test(this.#lookAtCharacter)) {
				const wordNode: Node = new Node(this.#canvasContext);
				do {
					wordNode.prependText(this.#getCharacterFromLooking());
					operatorName += this.#lookAtCharacter;
					if (
						this.#lookAtCharacter != null &&
						!["'"].includes(this.#lookAtCharacter)
					) {
						this.#readCharacter();
					}
					while (
						/<([a-z]+)_?([0-9a-z]+)>?/i.test(operatorName) &&
						/[0-9]/.test(this.#lookAtCharacter)
					) {
						operatorName += this.#lookAtCharacter;
						this.#readCharacter();
					}
				} while (
					this.#lookAtCharacter != null &&
					/[a-z><=_0-9]/i.test(this.#lookAtCharacter) &&
					!reservedWords.includes(operatorName)
				);
				if (!reservedWords.includes(operatorName)) {
					node.prependNode(wordNode);
				}
			}
			switch (operatorName) {
				case '<>':
				case '<=':
				case '>=':
				case 'sin':
				case 'cos':
				case 'tan':
				case 'asin':
				case 'acos':
				case 'atan':
				case 'sign':
				case 'gr':
				case 'ch':
				case 'or':
				case 'and':
				case 'year':
				case 'day':
				case 'month':
				case 'quarter':
				case '_day_of_year':
				case 'week':
				case '_week_day':
				case 'hour':
				case 'minute':
				case 'second':
				case 'half':
				case 'start_shift':
				case 'start_day':
				case 'start_month':
				case '<empty>':
				case '<fun_1>':
				case '<fun_2>':
				case '<fun_3>':
				case '<fun_4>':
				case '<fun_5>':
				case '<date_part>':
				case '<value_start>':
				case '<value_before>':
				case '<days_of_month>': {
					const startSectionIndex: number =
						this.#lookAtCharacterIndex - operatorName.length;
					node.prependNode(this.#scanFunction(operatorName));
					const sectionLength: number =
						this.#lookAtCharacterIndex - startSectionIndex;
					const emptyNode: Node = this.#getEmptyNode(
						this.#lookAtCharacterIndex - 1,
						sectionLength,
					);
					node.prependNode(emptyNode);
					break;
				}
				case 'square': {
					node.prependNode(this.#scanSquare());
					const emptyNode: Node = this.#getEmptyNode();
					node.prependNode(emptyNode);
					break;
				}

				case 'sqrt': {
					const SQRT_OPERATOR_LENGTH: number = 4;
					const startSectionIndex: number =
						this.#lookAtCharacterIndex - SQRT_OPERATOR_LENGTH;
					node.prependNode(this.#scanSqrt());
					const sectionLength: number =
						this.#lookAtCharacterIndex - startSectionIndex;
					const emptyNode: Node = this.#getEmptyNode(
						this.#lookAtCharacterIndex - 1,
						sectionLength,
					);
					node.prependNode(emptyNode);
					break;
				}

				case 'power': {
					node.prependNode(this.#scanPower());
					const emptyNode: Node = this.#getEmptyNode();
					node.prependNode(emptyNode);
					break;
				}
				case 'case': {
					node.prependNode(this.#scanCase());
					const emptyNode: Node = this.#getEmptyNode();
					node.prependNode(emptyNode);
					break;
				}
			}

			operatorName = '';
			switch (this.#lookAtCharacter) {
				case "'": {
					node.prependNode(this.#scanDate());
					break;
				}
				case ',':
				case 'end':
				case ')': {
					return node; //check
				}
				case '(': {
					node.prependNode(this.#scanBracket());
					const emptyNode: Node = this.#getEmptyNode();
					node.prependNode(emptyNode);
					node.hasExpression = true;
					this.#readCharacter();
					break;
				}
				default: {
					const simpleTextNode: Node | null = this.#scanBasic();
					if (simpleTextNode == null) continue;
					node.prependNode(simpleTextNode);
					node.hasExpression = simpleTextNode.hasExpression;
				}
			}
		}
		return node;
	}

	#scanBasic(): Node | null {
		const node: Node = new Node(this.#canvasContext);
		if (this.#lookAtCharacter == null) return null;
		while (
			this.#lookAtCharacter != null &&
			/[^a-z]/i.test(this.#lookAtCharacter) &&
			!isReserved(this.#lookAtCharacter)
		) {
			if (/-|\+|\*/.test(this.#lookAtCharacter)) node.hasExpression = true;
			this.#addCharacterToNode(node);
			this.#readCharacter();
		}
		node.registerDrawDecorationFunction(
			(canvasContext, mousePosition = { x: 0, y: 0 }) => {
				const canvasDOMRect: DOMRect =
					canvasContext.canvas.getBoundingClientRect();
				const { x: mousePositionX = 0, y: mousePositionY = 0 } =
					getMouseInCanvasPosition(mousePosition, canvasDOMRect);
				if (
					mousePositionX >= node.position.x &&
					node.position.x + node.size.x >= mousePositionX &&
					mousePositionY >= node.position.y &&
					node.position.y + node.size.y >= mousePositionY
				) {
					canvasContext.save();
					canvasContext.fillStyle = '#01234533';
					canvasContext.fillRect(
						node.position.x,
						node.position.y,
						node.size.x,
						node.size.y,
					);
					canvasContext.restore();
				}
			},
		);
		return node;
	}

	#scanBracket(): Node {
		const textNode: Node = new Node(this.#canvasContext);
		if (this.#lookAtCharacter == null) return textNode;
		const openBracket: FormulaChar = this.#getCharacterFromLooking();
		const openBracketOriginIndex: number = this.#lookAtCharacterIndex;
		textNode.prependText(openBracket);
		this.#readCharacter();
		const expression: Node | null = this.#getNodes();
		if (expression != null) textNode.prependNode(expression);
		if (this.#match(')')) {
			const closeBracket: FormulaChar = this.#getCharacterFromLooking();
			const bracketNode: Node = new Node(this.#canvasContext);
			bracketNode.prependText(closeBracket);
			this.#readCharacter();
			if (this.#match('/')) {
				const fractionSign: FormulaChar = this.#getCharacterFromLooking();
				bracketNode.prependText(fractionSign);
				this.#readCharacter();
				if (this.#match('(')) {
					const denominatorOpenBracket: FormulaChar =
						this.#getCharacterFromLooking();
					const denominatorOriginIndex: number = this.#lookAtCharacterIndex;
					bracketNode.prependText(denominatorOpenBracket);
					this.#readCharacter();
					textNode.prependNode(bracketNode);
					const denominatorExpression: Node | null = this.#getNodes();
					if (denominatorExpression != null) {
						textNode.prependNode(denominatorExpression);
					}
					if (this.#match(')')) {
						// вывод дроби
						const fractionNode: Node = new Node(this.#canvasContext);
						fractionNode.flow = 'vertical';
						fractionNode.alignItems = 'center';
						if (expression != null) {
							const emptyNode: Node = new Node(this.#canvasContext);
							this.#addCharacterToNode(emptyNode, '', openBracketOriginIndex);
							expression.appendNode(emptyNode);
							expression.padding = [0, 0, 5, 0];
							fractionNode.prependNode(expression);
						}
						if (denominatorExpression != null) {
							const emptyNode: Node = new Node(this.#canvasContext);
							this.#addCharacterToNode(emptyNode, '', denominatorOriginIndex);
							denominatorExpression.padding = [10, 0, 0, 0];
							denominatorExpression.appendNode(emptyNode);
							fractionNode.prependNode(denominatorExpression);
						}
						fractionNode.registerDrawDecorationFunction((canvasContext) => {
							const DIVIDER_WEIGHT: number = 2;
							canvasContext.fillRect(
								fractionNode.position.x + 2,
								expression.position.y + expression.size.y - DIVIDER_WEIGHT,
								fractionNode.size.x - 4,
								DIVIDER_WEIGHT,
							);
						});
						return fractionNode;
					}
					return textNode;
				}
			}
			textNode.prependNode(bracketNode);
		}
		return textNode;
	}

	/**
	 * Выводит фрагмент формулы в виде функции типа `f(args)`
	 * @param functionName Имя выводимой функции
	 * @returns Узел формулы
	 */
	#scanFunction(functionName: string): Node {
		const functionNode: Node = new Node(this.#canvasContext);
		const operatorNameNode: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(
			operatorNameNode,
			replaceCharacter(functionName),
			this.#lookAtCharacterIndex - 1,
			functionName.length,
		);
		functionNode.prependNode(operatorNameNode);

		if (this.#match('(')) {
			const bracketStartNode: Node = new Node(this.#canvasContext);
			bracketStartNode.prependText(this.#getCharacterFromLooking());
			functionNode.prependNode(bracketStartNode);
			this.#readCharacter();

			const expressionNode: Node = new Node(this.#canvasContext);
			expressionNode.prependNode(this.#getNodes());

			while (this.#lookAtCharacter !== ')') {
				if (this.#lookAtCharacter === ',') {
					const commaNode: Node = new Node(this.#canvasContext);
					this.#addCharacterToNode(commaNode, this.#lookAtCharacter);
					expressionNode.prependNode(commaNode);
					this.#readCharacter();

					const newExpressionNode: Node = this.#getNodes();
					expressionNode.prependNode(newExpressionNode);
				}
				if (this.#lookAtCharacter == null) {
					functionNode.prependNode(expressionNode);
					return functionNode;
				}
			}
			if (this.#match(')')) {
				const bracketEndNode: Node = new Node(this.#canvasContext);
				bracketEndNode.prependText(this.#getCharacterFromLooking());
				functionNode.prependNode(expressionNode);
				functionNode.prependNode(bracketEndNode);
				this.#readCharacter();
				if (functionName === 'ch' || functionName == 'gr') {
					functionNode.registerDrawDecorationFunction(
						(
							canvasContext,
							mousePosition = { x: 0, y: 0 },
							setActiveElement,
						) => {
							const canvasDOMRect: DOMRect =
								canvasContext.canvas.getBoundingClientRect();
							const { x: mousePositionX = 0, y: mousePositionY = 0 } =
								getMouseInCanvasPosition(mousePosition, canvasDOMRect);
							if (
								mousePositionX > functionNode.position.x &&
								mousePositionX <
									functionNode.position.x + functionNode.size.x &&
								mousePositionY > functionNode.position.y &&
								mousePositionY < functionNode.position.y + functionNode.size.y
							) {
								setActiveElement &&
									setActiveElement(`${functionName}:${expressionNode.rawText}`);
							}
						},
					);
				}
				return functionNode;
			}

			functionNode.prependNode(bracketStartNode);
			functionNode.prependNode(expressionNode);
		}

		return functionNode;
	}

	/**
	 * Определение квадратного корня
	 * @returns Узел формулы
	 */
	#scanSqrt(): Node {
		const sqrtNode: Node = new Node(this.#canvasContext);
		const sqrtSignNode: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(
			sqrtSignNode,
			'√',
			this.#lookAtCharacterIndex - 1,
			4,
		);
		sqrtNode.prependNode(sqrtSignNode);
		if (this.#match('(')) {
			const bracketStartNode: Node = new Node(this.#canvasContext);
			bracketStartNode.prependText(this.#getCharacterFromLooking());
			const emptyNode: Node = this.#getEmptyNode(this.#lookAtCharacterIndex);
			this.#readCharacter();

			const expressionNode: Node = this.#getNodes();
			expressionNode.appendNode(emptyNode);
			expressionNode.recalculateNodeSize();
			sqrtSignNode.fontSize = expressionNode.size.y;

			if (this.#match(')')) {
				sqrtNode.prependNode(expressionNode);
				const TAIL_SIZE_Y_FRACTION: number = 5.33333333;
				const TALL_SIZE_X_FRACTION: number = 10.66666666;
				const tallSizeY: number = sqrtSignNode.fontSize / TAIL_SIZE_Y_FRACTION;
				const tallSizeX: number = sqrtSignNode.fontSize / TALL_SIZE_X_FRACTION;
				const closeEmptyNode: Node = this.#getEmptyNode();
				sqrtNode.prependNode(closeEmptyNode);
				sqrtNode.registerDrawDecorationFunction((canvasContext) => {
					canvasContext.fillRect(
						sqrtSignNode.position.x + sqrtSignNode.size.x + tallSizeX,
						Math.max(0, sqrtSignNode.position.y - tallSizeY),
						expressionNode.size.x,
						2,
					);
					canvasContext.fillRect(
						sqrtSignNode.position.x +
							sqrtSignNode.size.x +
							tallSizeX +
							expressionNode.size.x -
							2,
						Math.max(0, sqrtSignNode.position.y - tallSizeY),
						2,
						10,
					);
				});
				this.#readCharacter();
				return sqrtNode;
			}
			sqrtNode.prependNode(bracketStartNode);
			sqrtNode.prependNode(expressionNode);
		}
		return sqrtNode;
	}

	#scanPower(): Node {
		const powerNode: Node = new Node(this.#canvasContext);
		const operatorNode: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(operatorNode, 'power');

		if (this.#match('(')) {
			const bracketStartNode: Node = new Node(this.#canvasContext);
			bracketStartNode.prependText(this.#getCharacterFromLooking());
			this.#readCharacter();

			const baseNode: Node = this.#getNodes();
			const indexOfBaseNodeExpressionEnd: number =
				this.#lookAtCharacterIndex - 1;
			if (this.#match(',')) {
				const powerExpressionOriginStartIndex: number =
					this.#lookAtCharacterIndex;
				this.#readCharacter();
				const powerExpressionNode: Node = this.#getNodes();
				powerExpressionNode.fontSize = 16;
				powerExpressionNode.recalculateNodeSize();
				powerExpressionNode.padding = [
					0 - powerExpressionNode.midline,
					0,
					0,
					0,
				];

				if (this.#match(')')) {
					if (baseNode.hasExpression) {
						powerNode.prependNode(bracketStartNode);
					}
					powerNode.prependNode(baseNode);
					if (baseNode.hasExpression) {
						const closeBaseBracketNode: Node = new Node(this.#canvasContext);
						this.#addCharacterToNode(
							closeBaseBracketNode,
							')',
							indexOfBaseNodeExpressionEnd,
						);
						powerNode.prependNode(closeBaseBracketNode);
					}
					const emptyNode: Node = this.#getEmptyNode(
						powerExpressionOriginStartIndex,
					);
					emptyNode.fontSize = 16;
					emptyNode.recalculateNodeSize();
					powerExpressionNode.appendNode(emptyNode);
					powerNode.prependNode(powerExpressionNode);
					this.#readCharacter();
					return powerNode;
				}
			}
		}
		return powerNode;
	}

	#scanDate(): Node {
		const dateNode: Node = new Node(this.#canvasContext);
		if (this.#lookAtCharacter === "'") this.#readCharacter();
		let date = '';
		while (this.#lookAtCharacter !== "'") {
			date += this.#lookAtCharacter;
			this.#readCharacter();
		}

		this.#addCharacterToNode(dateNode, formatStringDateToDefault(date));
		this.#readCharacter();
		return dateNode;
	}

	#scanSquare(): Node {
		const powerNode: Node = new Node(this.#canvasContext);
		const operatorNode: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(operatorNode, 'square');

		if (this.#match('(')) {
			const bracketStartNode: Node = new Node(this.#canvasContext);
			bracketStartNode.prependText(this.#getCharacterFromLooking());
			this.#readCharacter();

			const baseNode: Node = this.#getNodes();
			const indexOfBaseNodeExpressionEnd: number =
				this.#lookAtCharacterIndex - 1;
			const powerExpressionNode: Node = new Node(this.#canvasContext);
			this.#addCharacterToNode(powerExpressionNode, '2');
			powerExpressionNode.fontSize = 16;
			powerExpressionNode.recalculateNodeSize();
			powerExpressionNode.padding = [0 - powerExpressionNode.midline, 0, 0, 0];
			if (this.#match(')')) {
				powerNode.prependNode(baseNode);
				if (baseNode.hasExpression) {
					powerNode.appendNode(bracketStartNode);
					const closeBaseBracketNode: Node = new Node(this.#canvasContext);
					this.#addCharacterToNode(
						closeBaseBracketNode,
						')',
						indexOfBaseNodeExpressionEnd,
					);
					powerNode.prependNode(closeBaseBracketNode);
				}
				powerNode.prependNode(powerExpressionNode);
				this.#readCharacter();
				return powerNode;
			}
		}
		return powerNode;
	}

	#scanCase(): Node {
		const caseTextNode: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(caseTextNode, 'case');
		const endWordFailNode: Node = new Node(this.#canvasContext);
		const caseFinalNode: Node = new Node(this.#canvasContext);
		caseFinalNode.flow = 'vertical';
		while (
			this.#lookAtCharacter != null &&
			!this.#hasWord('end', endWordFailNode)
		) {
			caseFinalNode.prependNode(this.#scanWhen());
			this.#readCharacter();
		}
		caseFinalNode.padding = [0, 0, 0, 10];
		caseFinalNode.registerDrawDecorationFunction((canvas) => {
			canvas.fillRect(
				caseFinalNode.position.x + 4,
				caseFinalNode.position.y,
				2,
				caseFinalNode.size.y - 10,
			);
		});
		return caseFinalNode;
	}

	#scanWhen(): Node {
		const tryWhenNode: Node = new Node(this.#canvasContext);
		const partialWhenNode: Node = new Node(this.#canvasContext);
		if (this.#hasWord('when', tryWhenNode)) {
			const compliteWhenNode: Node = new Node(this.#canvasContext);
			this.#addCharacterToNode(
				compliteWhenNode,
				'when',
				this.#lookAtCharacterIndex - 1,
				4,
			);
			const openBracket: Node = new Node(this.#canvasContext);
			openBracket.prependText(this.#getCharacterFromLooking());
			partialWhenNode.prependNode(compliteWhenNode);

			if (this.#match('(')) {
				const delimeter: Node = new Node(this.#canvasContext);

				// размер 1 символ, так как при удалении должна исчезнуть
				// закрывающаяся скобка секции then
				this.#addCharacterToNode(
					delimeter,
					', ',
					this.#lookAtCharacterIndex,
					1,
				);

				this.#readCharacter();

				const condition: Node = this.#getNodes();

				const closeBracket: Node = new Node(this.#canvasContext);
				closeBracket.prependText(this.#getCharacterFromLooking());

				partialWhenNode.prependNode(openBracket);
				partialWhenNode.prependNode(condition);

				if (this.#match(')')) {
					this.#readCharacter();
					const tryThenNode: Node = new Node(this.#canvasContext);

					partialWhenNode.prependNode(closeBracket);

					if (this.#hasWord('then', tryThenNode)) {
						const compliteThenNode: Node = new Node(this.#canvasContext);
						this.#addCharacterToNode(
							compliteThenNode,
							'then',
							this.#lookAtCharacterIndex - 1,
							4,
						);
						const openThenBracket: Node = new Node(this.#canvasContext);
						openBracket.prependText(this.#getCharacterFromLooking());
						partialWhenNode.prependNode(compliteThenNode);

						if (this.#match('(')) {
							const emptyBeforeThen: Node = this.#getEmptyNode(
								this.#lookAtCharacterIndex,
							);
							this.#readCharacter();

							const expression: Node = this.#getNodes();

							partialWhenNode.prependNode(openThenBracket);
							partialWhenNode.prependNode(expression);

							if (this.#match(')')) {
								const whenNode: Node = new Node(this.#canvasContext);

								whenNode.prependNode(emptyBeforeThen);
								whenNode.prependNode(expression);
								whenNode.prependNode(delimeter);
								whenNode.prependNode(condition);

								whenNode.padding = [0, 0, 10, 0];

								return whenNode;
							}

							return partialWhenNode;
						}
					}

					partialWhenNode.prependNode(tryThenNode);
					return partialWhenNode;
				}
				return partialWhenNode;
			}
			return partialWhenNode;
		}
		return tryWhenNode;
	}

	#hasWord(testingWord: string, failTextNode: Node | null = null): boolean {
		let word: string = '';
		let beforeCharacterIndex: number = this.#lookAtCharacterIndex;
		const templateRegEx: RegExp = new RegExp(
			testingWord.split('').join('|'),
			'i',
		);
		while (
			this.#lookAtCharacter != null &&
			templateRegEx.test(this.#lookAtCharacter)
		) {
			word += this.#lookAtCharacter;
			this.#readCharacter();
		}
		if (word !== testingWord) {
			if (failTextNode == null) return false;
			for (const character of word) {
				this.#addCharacterToNode(failTextNode, character, beforeCharacterIndex);
				beforeCharacterIndex += 1;
			}
			return false;
		}
		return true;
	}

	#addCharacterToNode(
		node: Node,
		character: string | null = this.#lookAtCharacter,
		originIndex: number = this.#lookAtCharacterIndex,
		length?: number,
	): FormulaChar | null {
		if (character == null) return null;
		const replacedCharacter: string = replaceCharacter(character);
		const hasLength: boolean = length != null && length > 0;
		const formulaCharacter: FormulaChar = {
			character: replacedCharacter,
			position: { x: 0, y: 0 },
			size: { x: 0, y: 0 },
			originIndex,
			originLength: hasLength ? length : character.length,
		};
		node.prependText(formulaCharacter);
		return formulaCharacter;
	}

	#getCharacterFromLooking(): FormulaChar {
		const character: string = replaceCharacter(this.#lookAtCharacter || '');
		return {
			character,
			position: { x: 0, y: 0 },
			size: { x: 0, y: 0 },
			originIndex: this.#lookAtCharacterIndex,
		};
	}

	#match(character: string): boolean {
		return this.#lookAtCharacter != null && this.#lookAtCharacter === character;
	}

	#getEmptyNode(
		originIndex: number = this.#lookAtCharacterIndex,
		length: number = 1,
	) {
		const node: Node = new Node(this.#canvasContext);
		this.#addCharacterToNode(node, '', originIndex, length);
		return node;
	}
}
