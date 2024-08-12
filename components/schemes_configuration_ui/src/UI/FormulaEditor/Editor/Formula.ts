import { FormulaChar, ParseResult, Vector2D } from '../types';

import {
	calculateNodeBaseline,
	calculateNodeBoundingBox,
	drawFormula,
} from './ParserWithLexer/Drawer/utils';
import Lexer from './ParserWithLexer/Parser/Lexer';
import Node from './ParserWithLexer/Parser/Node';
import TreeBuilder from './ParserWithLexer/Parser/TreeBuilder/TreeBuilder';
import { Cursor } from './Cursor';
import { InputHistory } from './editHistory';

export default class Formula {
	#text: string = '';
	#renderFormula: FormulaChar[] = [];
	#previousText: string | null = null;
	#parsedFormula: ParseResult = { text: [], decorations: [] };
	#inputHistory: InputHistory;
	#cursor: Cursor;

	#mouseCursorPosition: Vector2D = { x: 0, y: 0 };
	#activeFormulaElement: string = '';

	#onClick: ((element: string) => void) | undefined;
	#setFormulaText: ((formulaText: string) => void) | undefined;

	#treeBuilder: TreeBuilder;

	#treeNode: Node = new Node();

	constructor(
		cursor: Cursor,
		inputHistory: InputHistory,
		onClick?: (element: string) => void,
		setFormulaText?: (formulaText: string) => void,
	) {
		this.#cursor = cursor;
		this.#inputHistory = inputHistory;
		this.#onClick = onClick;
		this.#setFormulaText = setFormulaText;
		const lexer = new Lexer();
		this.#treeBuilder = new TreeBuilder(lexer);
		window.addEventListener('mousemove', this.#handleMouseMove.bind(this));
		window.addEventListener('click', this.#handleMouseClick.bind(this));
	}

	#handleMouseClick() {
		this.#activeFormulaElement !== '' &&
			this.#onClick &&
			this.#onClick(this.#activeFormulaElement);
		this.#activeFormulaElement = '';
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
		this.#setFormulaText && this.#setFormulaText(this.#text); //todo remove
	}

	insert(character: string) {
		const { charInPosition, charNextPosition } = this.#cursor;
		if (charInPosition == null && charNextPosition == null) return;
		const { originIndex } = charInPosition || charNextPosition || {};
		const characterPosition: number = (originIndex || 0) + 1;

		this.setText(
			`${this.#text.slice(0, characterPosition)}${character}${this.#text.slice(
				characterPosition,
			)}`,
		);
		this.#cursor.position += 1;
		this.#setFormulaText && this.#setFormulaText(this.#text); //todo remove
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
		this.#setFormulaText && this.#setFormulaText(this.#text); //todo remove
	}

	render(context: CanvasRenderingContext2D) {
		if (this.text !== this.#previousText) {
			this.#treeNode = this.#treeBuilder.build(this.text);
			calculateNodeBoundingBox(this.#treeNode, 32, context);
			calculateNodeBaseline(this.#treeNode);

			this.#previousText = this.text;
			console.log(this.text, this.#treeNode);
		}

		this.#cursor.text = drawFormula(
			this.#treeNode,
			32,
			{ x: 5, y: 5 },
			context,
		);
		// context.save();
		// for (const character of this.#parsedFormula.text) {
		// 	if (character == null) continue;
		// 	if ('fontSize' in character) {
		// 		context.font = `${character.fontSize}px serif`;
		// 	}
		// 	context.fillStyle = character.color || 'black';
		// 	context.fillText(
		// 		character.character,
		// 		character.position.x,
		// 		character.position.y,
		// 	);
		// 	context.restore();
		// }
		//
		// for (const drawDecoration of this.#parsedFormula.decorations) {
		// 	drawDecoration(
		// 		context,
		// 		this.#mouseCursorPosition,
		// 		this.#setActiveElement.bind(this),
		// 	);
		// }
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
