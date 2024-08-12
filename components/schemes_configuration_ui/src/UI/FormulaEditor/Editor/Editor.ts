import Animation from './Animation';
import { Cursor } from './Cursor';
import { InputHistory } from './editHistory';
import Formula from './Formula';
import Input from './Input';
import {
	backspace,
	deleteCharacter,
	endCursor,
	enter,
	homeCursor,
	insertCharacter,
	leftCursor,
	rightCursor,
} from './inputHandlers';
import { clearCanvas, renderCursor, renderFormula } from './renders';

export default class Editor {
	#context: CanvasRenderingContext2D | null = null;
	#formula: Formula | null = null;
	#cursor: Cursor;
	#lineHeight: number = 36;
	#animation: Animation;
	#input: Input;
	#inputHistory: InputHistory = new InputHistory();

	constructor(input: Input) {
		this.#animation = new Animation();
		this.#cursor = new Cursor();
		this.#input = input;
	}

	registeredCanvasContext(
		canvasContext: CanvasRenderingContext2D,
		onFolmulaElementClick?: (element: string) => void,
		setFormulaText?: (formulaText: string) => void,
	) {
		this.#context = canvasContext;
		this.#context.canvas.height = 600;
		this.#context.canvas.width = 2500;
		this.#formula = new Formula(
			this.#cursor,
			this.#inputHistory,
			onFolmulaElementClick,
			setFormulaText,
		);
	}

	#prepareInputs() {
		this.#input.registerRightHandlers(rightCursor(this.#cursor));
		this.#input.registerLeftHandler(leftCursor(this.#cursor));
		this.#input.registerHomeHandler(homeCursor(this.#cursor));
		this.#input.registerEndHandler(endCursor(this.#cursor));
		if (this.#formula) {
			this.#input.registerInputHandler(
				insertCharacter(this.#formula, this.#cursor),
			);
			this.#input.registerDeleteHandler(
				deleteCharacter(this.#formula, this.#cursor),
			);
			this.#input.registerBackspaceHandlers(
				backspace(this.#formula, this.#cursor),
			);
			this.#input.registerEnterHandler(enter(this.#formula));
		}
	}

	#prepareRenders() {
		if (this.#context == null || this.#formula == null) return;
		this.#animation.addRender(clearCanvas(this.#context, this.#lineHeight));
		this.#animation.addRender(renderFormula(this.#context, this.#formula));
		this.#animation.addRender(renderCursor(this.#context, this.#cursor));
	}

	#prepareUpdates() {
		this.#animation.addUpdate(this.#cursor.update.bind(this.#cursor));
	}
	setFormulaText(text: string): void {
		if (this.#formula) this.#formula.setText(text);
	}

	undo(): void {
		this.#formula?.undo();
	}

	redo(): void {
		this.#formula?.redo();
	}

	canUndo(): boolean {
		return this.#inputHistory.canUndo();
	}

	canRedo(): boolean {
		return this.#inputHistory.canRedo();
	}

	insertCharacter(character: string): void {
		if (this.#formula) this.#formula.insert(character);
	}

	clearFormula(): void {
		this.#formula?.delete(0, this.#formula?.text.length);
	}

	run() {
		this.#prepareUpdates();
		this.#prepareRenders();
		this.#prepareInputs();
		this.#animation.animate(Number(document.timeline.currentTime));
	}

	get formula() {
		return this.#formula;
	}

	stop() {
		this.#animation.stop();
	}
}
