import { FormulaChar } from '../types';

export class Cursor {
	#BLINK_INTERVAL: number = 500;
	#position: number = 0;
	#accTime: number = 0;
	#isShown: boolean = true;
	#text: FormulaChar[] = [];

	get originPosition(): number {
		if (this.#position > this.#text.length) this.#position = this.#text.length;
		const character: FormulaChar = this.#text[this.position - 1];
		return character ? character.originIndex || 0 : 0;
	}

	get position() {
		return this.#position;
	}

	set text(value: FormulaChar[]) {
		this.#text = value;
	}

	get charPrevPosition(): FormulaChar | undefined {
		return this.#text[this.position - 1];
	}

	get charInPosition(): FormulaChar | undefined {
		return this.#text[this.position];
	}

	get charNextPosition(): FormulaChar | undefined {
		return this.#text[this.position + 1];
	}

	get xPosition(): number {
		if (this.position >= this.#text.length)
			this.#position = this.#text.length - 1;
		const { position = { x: 0, y: 0 }, size = { x: 0, y: 0 } } =
			this.charInPosition || {};
		return position.x + size.x;
	}

	get yPosition(): number {
		const { position = { x: 0, y: 0 } } = this.charInPosition || {};
		return position.y;
	}

	get size(): number {
		const lookAtCharacter: FormulaChar | undefined =
			this.position !== 0 ? this.charInPosition : this.charNextPosition;
		return lookAtCharacter?.size.y || 32;
	}

	set position(positionIndex: number) {
		this.#position = positionIndex;
	}

	get isShown() {
		return this.#isShown;
	}

	set isShown(value: boolean) {
		this.#isShown = value;
		this.#accTime = 0;
	}

	left() {
		if (this.#position === 0) return;
		this.#position -= 1;
	}

	right() {
		if (this.#position >= this.#text.length - 1) return;
		this.#position += 1;
	}

	end() {
		if (this.#position === this.#text.length) return;
		this.#position = this.#text.length;
	}

	home() {
		if (this.#position === 0) return;
		this.#position = 0;
	}

	update(deltaTime: number) {
		if (this.#accTime >= this.#BLINK_INTERVAL) {
			this.#isShown = !this.#isShown;
			this.#accTime = 0;
			return;
		}
		if (Number.isNaN(deltaTime)) return;
		this.#accTime += deltaTime;
	}
}
