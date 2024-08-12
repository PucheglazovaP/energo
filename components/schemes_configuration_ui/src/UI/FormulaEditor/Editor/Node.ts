import {
	Align,
	Direction,
	DrawFunction,
	FormulaChar,
	Vector2D,
} from '../types';

class Node {
	#children: Node[] = [];
	#position: Vector2D = { x: 0, y: 0 };
	#fontSize: number = 32;
	#size: Vector2D = { x: 0, y: 0 };
	#padding: number[] = [0, 0, 0, 0];
	#boundingBox: number[] = [0, 0, 0, 0];
	#text: FormulaChar[] = [];
	#textBoxSize: Vector2D = { x: 0, y: 0 };
	#flow: Direction = 'horizontal';
	#alignItems: Align = 'midline';
	#canvasContext: CanvasRenderingContext2D;
	#midline: number = 0;
	#renderDecorationFunctions: DrawFunction[] = [];
	#hasExpression: boolean = false;

	/**
	 * Размер узла вместе с дочерними узлами
	 */
	get size(): Vector2D {
		return this.#size;
	}

	get position(): Vector2D {
		return this.#position;
	}

	/**
	 * Размер блока текста
	 */
	get textSize(): Vector2D {
		return this.#textBoxSize;
	}

	/**
	 * Положение сторон узла на холсте
	 * `[Верх, Право, Низ, Лево]`
	 */
	get boundingBox(): number[] {
		return this.#boundingBox;
	}

	/**
	 * Выравнивание дочерних блоков
	 */
	get alignItems(): Align {
		return this.#alignItems;
	}

	get midline(): number {
		return this.#midline;
	}

	get fontSize(): number {
		return this.#fontSize;
	}

	get hasExpression(): boolean {
		return this.#hasExpression;
	}

	get rawText(): string {
		let text = this.#text.map(({ character }) => character).join('');
		for (const node of this.#children) text += node.rawText;
		return text;
	}

	/**
	 * Направление размещения дочерних узлов формулы
	 * ```
	 * horizontal (default)
	 * ╭─────╮ ╭─────╮
	 * ╰─────╯ ╰─────╯
	 * vertical
	 * ╭─────╮
	 * ╰─────╯
	 * ╭─────╮
	 * ╰─────╯
	 * ```
	 */
	set flow(newFlow: Direction) {
		this.#flow = newFlow;
	}

	/**
	 * Отступы вокруг текста в текущем узле
	 * `[Верх, Право, Низ, Лево]`
	 */
	set padding(newPadding: number[]) {
		this.#padding = newPadding;
	}

	/**
	 * Устанавливает активный размер шрифта для текущей ноды
	 */
	set fontSize(newFontSize: number) {
		this.#fontSize = newFontSize;
		for (const node of this.#children) {
			node.fontSize = newFontSize;
		}
	}

	/**
	 * Устанавливает активное выравнивание блоков
	 */
	set alignItems(newAlign: Align) {
		this.#alignItems = newAlign;
	}

	/**
	 * Устанавливает линию середины ноды
	 */
	set midline(newMidline: number) {
		this.#midline = newMidline;
	}

	set hasExpression(newHasExpression: boolean) {
		this.#hasExpression = newHasExpression;
	}

	constructor(canvasContext: CanvasRenderingContext2D) {
		this.#canvasContext = canvasContext;
	}

	/**
	 * Вставляет узел фрагмента формулы в начало формулы
	 * @param node вставляемый узел
	 */
	appendNode(node: Node) {
		this.#children = [node, ...this.#children];
	}

	/**
	 * Вставляет узел фрагмента формулы в конец формулы
	 * @param node вставляемый узел
	 */
	prependNode(node: Node) {
		this.#children.push(node);
	}

	/**
	 * Размещает символ в начало текста формулы
	 * увеличивает счётчик размера текста
	 * @param text вставляемый символ
	 */
	appendText(text: FormulaChar) {
		this.#text = [text, ...this.#text];
	}

	/**
	 * Размещает символ в конец текста формулы
	 * увеличивает счётчик размера текста
	 * @param text вставляемый символ
	 */
	prependText(text: FormulaChar) {
		this.#text.push(text);
	}

	/**
	 * Формирует текст формулы на основе текста и дочерних блоков
	 * для вывода в редактор
	 *
	 * @returns текст формулы для вывода
	 */
	getFormulaText(): FormulaChar[] {
		const formulaText: FormulaChar[] = [];
		const [paddingTop, , , paddingLeft] = this.#padding;
		let previousFlowPosition: number = this.#position.x + paddingLeft;
		for (const formulaCharacter of this.#text) {
			formulaCharacter.position.x = previousFlowPosition;
			formulaCharacter.position.y = this.#position.y + paddingTop;
			formulaCharacter.fontSize = this.#fontSize;
			previousFlowPosition += formulaCharacter.size.x;
			formulaText.push(formulaCharacter);
		}
		for (const node of this.#children) {
			formulaText.push(...node.getFormulaText());
		}
		return formulaText;
	}

	/**
	 * Устанавливает новые размеры блока
	 */
	recalculateNodeSize() {
		this.#setCharacterBoxSize();
		const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
			this.#padding;
		const nodeSize: Vector2D = {
			x: 0,
			y: this.#textBoxSize.y,
		};
		for (const node of this.#children) {
			node.recalculateNodeSize();
			if (this.#flow === 'horizontal') {
				nodeSize.x += node.size.x;
				nodeSize.y = Math.max(nodeSize.y, node.size.y, this.#textBoxSize.y, 0);
			}

			if (this.#flow === 'vertical') {
				nodeSize.x = Math.max(node.size.x, nodeSize.x, this.#textBoxSize.x, 0);
				nodeSize.y += node.size.y;
			}
		}

		if (this.#flow === 'vertical') {
			nodeSize.y += this.#textBoxSize.y;
			this.#size = nodeSize;
			if (this.#children.length === 2) {
				const [firstNode] = this.#children;
				this.#midline = firstNode.size.y;
			}
			this.#midline = this.#size.y * 0.5;
			return;
		}
		nodeSize.x += paddingLeft + this.#textBoxSize.x + paddingRight;
		nodeSize.y += paddingTop + paddingBottom;
		this.#size = nodeSize;

		this.#midline = this.#size.y * 0.5;
	}

	/**
	 * Пересчитывает положение блоков в формуле
	 *
	 * @param initialPosition начальное положение блока, относительно которого
	 * рассчитываются положение остальных блоков
	 */
	recalculateNodePosition(initialPosition: Vector2D) {
		this.#position.x += initialPosition.x;
		this.#position.y += initialPosition.y;

		const [paddingTop, , , paddingLeft] = this.#padding;

		if (this.#flow === 'vertical') {
			let previousFlowPosition: number =
				this.#position.y + this.#textBoxSize.y + paddingTop;
			for (const node of this.#children) {
				const x: number =
					this.#alignChildrenNodeInVerticalFlow(node) + paddingLeft;
				const y: number = previousFlowPosition;
				node.recalculateNodePosition({ x, y });
				previousFlowPosition += node.size.y;
			}

			this.#boundingBox = [
				this.#position.y,
				this.#size.x + this.#position.x,
				this.#position.y + previousFlowPosition,
				this.#position.x,
			];
		}

		if (this.#flow === 'horizontal') {
			let previousFlowPosition: number =
				this.#position.x + this.#textBoxSize.x + paddingLeft;
			for (const node of this.#children) {
				const x: number = previousFlowPosition;
				const y: number =
					this.#alignChildrenNodeInHorizontalFlow(node) + paddingTop;
				node.recalculateNodePosition({ x, y });
				previousFlowPosition += node.size.x;
			}

			this.#boundingBox = [
				this.#position.y,
				previousFlowPosition,
				this.#position.y + this.#size.y,
				this.#position.x,
			];
		}
	}

	registerDrawDecorationFunction(registeredFunction: DrawFunction) {
		this.#renderDecorationFunctions.push(registeredFunction);
	}

	getDrawFunctions(): DrawFunction[] {
		const functions: DrawFunction[] = [];
		for (const node of this.#children) {
			functions.push(...node.getDrawFunctions());
		}
		return [...this.#renderDecorationFunctions, ...functions];
	}

	/**
	 * Рассчитывает положение ноды в зависимости от выбранного выравнивания
	 * по вертикали
	 *
	 * @param node Нода для которой рассчитывается положение
	 * @returns положение по оси Х
	 */
	#alignChildrenNodeInVerticalFlow(node: Node): number {
		switch (this.#alignItems) {
			case 'center': {
				return this.#position.x + this.#size.x * 0.5 - node.size.x * 0.5;
			}
			case 'end': {
				return this.#position.x + this.#size.x - node.size.x;
			}
			default: {
				return this.#position.x;
			}
		}
	}

	#alignChildrenNodeInHorizontalFlow(node: Node): number {
		switch (this.#alignItems) {
			case 'center': {
				return this.#position.y + this.size.y * 0.5 - node.size.y * 0.5;
			}
			case 'start': {
				return this.#position.y;
			}
			case 'end': {
				return this.#position.y + this.size.y - node.size.y;
			}
			default: {
				const maxMidlinePosition = Math.max(
					...this.#children.map((child) => child.midline),
				);
				return this.#position.y + maxMidlinePosition - node.midline;
			}
		}
	}

	#setCharacterBoxSize() {
		this.#textBoxSize.x = 0;
		for (const char of this.#text) {
			const characterSize: Vector2D = this.#getCharacterSize(char.character);
			char.size = characterSize;
			this.#textBoxSize.x += characterSize.x;
			this.#textBoxSize.y = Math.max(this.#textBoxSize.y, characterSize.y);
		}
	}

	/**
	 * Измеряет вводимый символ (ширина, высота) в зависимости от установленного
	 * размера шрифта в CanvasContext
	 * @param character Измеряемый символ
	 * @returns Размер символа
	 */
	#getCharacterSize(character: string): Vector2D {
		this.#canvasContext.save();
		this.#canvasContext.font = `${this.#fontSize}px serif`;
		const textMetrics: TextMetrics = this.#canvasContext.measureText(character);
		const { width } = textMetrics;
		this.#canvasContext.restore();
		return {
			x: width,
			y: this.#fontSize,
		};
	}

	/**
	 * Устанавливает размеры для текущего символа,
	 * рассчитывает общий размер текста
	 * @param character вводимый символ
	 */
	#setTextSize(character: FormulaChar) {
		const characterSize: Vector2D = this.#getCharacterSize(character.character);
		character.size = characterSize;
		this.#textBoxSize.x += characterSize.x;
		this.#textBoxSize.y = characterSize.y;
	}
}

export default Node;
