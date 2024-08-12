import { Cursor } from './Cursor';
import Formula from './Formula';

export function rightCursor(cursor: Cursor) {
	return function handle() {
		cursor.right();
		cursor.isShown = true;
	};
}

export function leftCursor(cursor: Cursor) {
	return function handle() {
		cursor.left();
		cursor.isShown = true;
	};
}

export function homeCursor(cursor: Cursor) {
	return function handle() {
		cursor.home();
		cursor.isShown = true;
	};
}

export function endCursor(cursor: Cursor) {
	return function handle() {
		cursor.end();
		cursor.isShown = true;
	};
}

export function insertCharacter(formula: Formula, cursor: Cursor) {
	return function handle(event: KeyboardEvent) {
		formula.insert(event.key);
		cursor.isShown = true;
	};
}

export function deleteCharacter(formula: Formula, cursor: Cursor) {
	return function handle() {
		const { charNextPosition } = cursor;
		if (charNextPosition == null) return;
		const { originIndex } = charNextPosition;
		if (originIndex == null) return;

		formula.delete(originIndex, 1);
		cursor.isShown = true;
	};
}

export function backspace(formula: Formula, cursor: Cursor) {
	return function handle() {
		const { charInPosition = { originLength: 1, originIndex: -1 } } = cursor;
		const { originLength: characterLength, originIndex = -1 } = charInPosition;
		if (originIndex != null && originIndex === -1) return;

		formula.delete(originIndex, characterLength);
		cursor.left();
		cursor.isShown = true;
	};
}

export function enter(formula: Formula) {
	return function handle() {
		formula.enter();
	};
}
