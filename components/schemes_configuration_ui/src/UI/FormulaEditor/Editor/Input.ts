import { KeyboardFunction } from '../types';

export default class Input {
	#backspaceHandlers: KeyboardFunction[] = [];
	#rightHandlers: KeyboardFunction[] = [];
	#leftHandlers: KeyboardFunction[] = [];
	#deleteHandlers: KeyboardFunction[] = [];
	#homeHandlers: KeyboardFunction[] = [];
	#endHandlers: KeyboardFunction[] = [];
	#inputHandlers: KeyboardFunction[] = [];
	#enterHandlers: KeyboardFunction[] = [];

	registerBackspaceHandlers(handler: KeyboardFunction) {
		this.#backspaceHandlers.push(handler);
	}

	registerRightHandlers(handler: KeyboardFunction) {
		this.#rightHandlers.push(handler);
	}

	registerLeftHandler(handler: KeyboardFunction) {
		this.#leftHandlers.push(handler);
	}

	registerDeleteHandler(handler: KeyboardFunction) {
		this.#deleteHandlers.push(handler);
	}

	registerHomeHandler(handler: KeyboardFunction) {
		this.#homeHandlers.push(handler);
	}

	registerEndHandler(handler: KeyboardFunction) {
		this.#endHandlers.push(handler);
	}

	registerInputHandler(handler: KeyboardFunction) {
		this.#inputHandlers.push(handler);
	}

	registerEnterHandler(handler: KeyboardFunction) {
		this.#enterHandlers.push(handler);
	}

	keyupHandler(event: KeyboardEvent) {
		switch (event.key) {
			case 'Shift':
			case 'Control':
			case 'Tab':
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Meta':
				return;
			case 'Backspace':
				for (const backspace of this.#backspaceHandlers) backspace(event);
				return;
			case 'ArrowRight':
				for (const right of this.#rightHandlers) right(event);
				return;
			case 'ArrowLeft':
				for (const left of this.#leftHandlers) left(event);
				return;
			case 'Delete':
				for (const remove of this.#deleteHandlers) remove(event);
				return;
			case 'Home':
				for (const home of this.#homeHandlers) home(event);
				return;
			case 'End':
				for (const end of this.#endHandlers) end(event);
				return;
			case 'Enter':
				for (const enter of this.#enterHandlers) enter(event);
				return;
			default:
				for (const input of this.#inputHandlers) input(event);
		}
	}

	clickEvent(event: MouseEvent) {
		console.log(event);
	}
}
