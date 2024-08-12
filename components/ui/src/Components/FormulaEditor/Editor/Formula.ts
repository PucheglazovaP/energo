import { RefObject } from 'react';

import {
	calculateNodeBaseline,
	calculateNodeBoundingBox,
	drawFormula,
} from '../ParserWithLexer/Drawer/utils';
import Lexer from '../ParserWithLexer/Parser/Lexer';
import Node from '../ParserWithLexer/Parser/Node';
import TreeBuilder from '../ParserWithLexer/Parser/TreeBuilder/TreeBuilder';
import { FormulaChar, FormulaCharClickReduceReturn, Vector2D } from '../types';

import { Cursor } from './Cursor';
import { InputHistory } from './editHistory';
import { StringTemplate } from './types';
import { addFragmentTemplate } from './utils';

export default class Formula {
	#canvas: CanvasRenderingContext2D;
	#text: string = '';
	#renderFormula: FormulaChar[] = [];
	#previousText: string | null = null;
	#inputHistory: InputHistory;
	#cursor: Cursor;

	#mouseCursorPosition: Vector2D = { x: 0, y: 0 };
	#activeFormulaElement: string = '';

	#onClick: ((element: string) => void) | undefined;
	#setFormulaText: ((formulaText: string) => void) | undefined;

	#treeBuilder: TreeBuilder;
	#nodeTree: Node = new Node();
	#editorRef: RefObject<HTMLDivElement>;
	constructor(
		cursor: Cursor,
		inputHistory: InputHistory,
		onClick?: (element: string) => void,
		setFormulaText?: (formulaText: string) => void,
		canvas?: CanvasRenderingContext2D,
		editorRef?: RefObject<HTMLDivElement>,
	) {
		this.#cursor = cursor;
		this.#inputHistory = inputHistory;
		this.#onClick = onClick;
		this.#setFormulaText = setFormulaText;
		this.#canvas = canvas as CanvasRenderingContext2D;
		const lexer: Lexer = new Lexer(this.#cursor);
		this.#treeBuilder = new TreeBuilder(lexer);
		this.#editorRef = editorRef as RefObject<HTMLDivElement>;
		this.#canvas.canvas.addEventListener(
			'mousemove',
			this.#handleMouseMove.bind(this),
		);

		this.#canvas.canvas.addEventListener(
			'click',
			this.#handleMouseClick.bind(this),
		);
	}

	#handleMouseClick(e: MouseEvent) {
		this.#activeFormulaElement !== '' &&
			this.#onClick &&
			this.#onClick(this.#activeFormulaElement);
		const { clientX, clientY } = e;
		this.#activeFormulaElement = '';

		const startDelta: Vector2D = { x: 50, y: 50 };

		// Смещение канваса относительно экрана
		const { offsetLeft, offsetTop } = this.#canvas.canvas;

		// Значение смещения скролла канваса
		const { scrollTop, scrollLeft } = this.#editorRef.current!;

		// Смещение курсора
		const deltaOffset: Vector2D = { x: 10, y: 0 };

		// Позиция мыши на канвасе
		this.#mouseCursorPosition = {
			x: clientX - offsetLeft,
			y: clientY - offsetTop,
		};

		// Рассчет позиции символа относительно мыши для установки курсора
		const { formulaCharIndex }: FormulaCharClickReduceReturn =
			this.#renderFormula.reduce(
				(resultFormulaAcc, formulaChar, formulaCharIndex) => {
					const currentDelta: Vector2D = {
						x: Math.abs(
							formulaChar.position.x -
								this.#mouseCursorPosition.x +
								deltaOffset.x -
								scrollLeft,
						),
						y: Math.abs(
							formulaChar.position.y -
								this.#mouseCursorPosition.y +
								deltaOffset.y -
								scrollTop,
						),
					};

					if (
						currentDelta.x - 7 <= resultFormulaAcc.delta.x &&
						currentDelta.y - 7 <= resultFormulaAcc.delta.y
					) {
						return { formulaCharIndex: formulaCharIndex, delta: currentDelta };
					}

					return resultFormulaAcc;
				},
				{ formulaCharIndex: 0, delta: startDelta },
			);

		this.#cursor.position = formulaCharIndex;
	}

	setText(text: string) {
		this.#inputHistory.input(text);
		this.#text = this.#inputHistory.getActualInput();
	}

	undo() {
		if (!this.#inputHistory.canUndo()) return;
		this.#inputHistory.undo();
		this.#text = this.#inputHistory.getActualInput();
	}

	redo() {
		if (!this.#inputHistory.canRedo()) return;
		this.#inputHistory.redo();
		this.#text = this.#inputHistory.getActualInput();
	}

	#handleMouseMove(event: MouseEvent) {
		this.#mouseCursorPosition = { x: event.clientX, y: event.clientY };
	}

	characterAt(position: number): FormulaChar {
		return this.#renderFormula[position];
	}

	delete(from: number, count: number = 1) {
		if (from < -1 || from > this.#text.length) return;
		const firstPartToIndex: number = from - (count - 1);
		const firstPartOfText: string = this.#text.slice(0, firstPartToIndex);
		const secondPartOfText: string = this.#text.slice(from + 1);

		this.setText(`${firstPartOfText}${secondPartOfText}`);
		this.#setFormulaText && this.#setFormulaText(this.#text);
	}

	insert(character: string) {
		const { charInPosition, charNextPosition } = this.#cursor;
		if (charInPosition == null && charNextPosition == null) return;
		const { originIndex } = charInPosition || charNextPosition || {};
		const characterPosition: number = (originIndex || 0) + 1;

		const firstPartOfText: string = this.#text.slice(0, characterPosition);
		const secondPartOfText: string = this.#text.slice(characterPosition);
		const template: StringTemplate = addFragmentTemplate(
			firstPartOfText,
			character,
		);

		this.setText(
			`${firstPartOfText}${character}${template.template}${secondPartOfText}`,
		);
		this.#cursor.position += 1 + template.cursorShift;
		this.#setFormulaText && this.#setFormulaText(this.#text);
	}

	enter() {
		const { charInPosition } = this.#cursor;
		if (charInPosition == null) return;
		const { originIndex = 0 } = charInPosition;
		const characterPosition: number = originIndex + 1;
		const beforCursor: string = this.#text.slice(0, characterPosition);
		const afterCursor: string = this.#text.slice(characterPosition);
		const casePosition: number = beforCursor.indexOf('case');

		if (casePosition === -1) return;

		const whenRelativePosition: number = afterCursor.indexOf('when');
		const whenPosition: number = characterPosition + whenRelativePosition;
		const endRelativePosition: number = afterCursor.indexOf('end');
		const endPosition: number = characterPosition + endRelativePosition;

		if (endPosition < whenPosition || whenRelativePosition === -1) {
			const leftTextPart: string = this.#text.slice(0, endPosition);
			const rightTextPart: string = this.#text.slice(endPosition);
			this.setText(`${leftTextPart}when(0)then(0)${rightTextPart}`);
			this.#setFormulaText && this.#setFormulaText(this.#text);
			return;
		}

		const leftTextPart: string = this.#text.slice(0, whenPosition);
		const rightTextPart: string = this.#text.slice(whenPosition);
		this.setText(`${leftTextPart}when(0)then(0)${rightTextPart}`);
		this.#setFormulaText && this.#setFormulaText(this.#text);
	}

	render(context: CanvasRenderingContext2D) {
		if (this.text !== this.#previousText) {
			this.#nodeTree = this.#treeBuilder.build(this.text);
			calculateNodeBoundingBox(this.#nodeTree, 32, context);
			calculateNodeBaseline(this.#nodeTree);

			this.#previousText = this.text;
			console.log(this.text, this.#nodeTree);
		}
		this.#renderFormula = drawFormula(
			this.#nodeTree,
			32,
			{ x: 5, y: 0 },
			context,
		);
		this.#cursor.text = this.#renderFormula;
	}

	#setActiveElement(element: string): void {
		if (this.#activeFormulaElement !== element) {
			this.#activeFormulaElement = element;
		}
	}

	get text() {
		return this.#text;
	}
}
