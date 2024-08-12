import { useMemo } from 'react';

export class Stack<T> {
	#stack: T[] = [];
	push(value: T) {
		this.#stack.push(value);
	}

	pop(): T | undefined {
		return this.#stack.pop();
	}

	size(): number {
		return this.#stack.length;
	}

	clear() {
		this.#stack = [];
	}

	look() {
		return this.#stack[this.#stack.length - 1];
	}
}

export class InputHistory {
	#undoHistory: Stack<string> = new Stack();
	#redoHistory: Stack<string> = new Stack();

	input(value: string) {
		if (this.getActualInput() === value) return;
		this.#undoHistory.push(value);
	}

	undo() {
		const undoValue: string | undefined = this.#undoHistory.pop();
		if (undoValue == null) return;
		this.#redoHistory.push(undoValue);
	}

	redo() {
		const redoValue: string | undefined = this.#redoHistory.pop();
		if (redoValue == null) return;
		this.#undoHistory.push(redoValue);
	}

	getActualInput(): string {
		return this.#undoHistory.look() || '';
	}

	canUndo(): boolean {
		return this.#undoHistory.size() > 0;
	}

	canRedo(): boolean {
		return this.#redoHistory.size() > 0;
	}
}

export function useInputHistory() {
	const inputHistory: InputHistory = useMemo(() => new InputHistory(), []);
	return inputHistory;
}
