import { UpdateFunction } from '../types';

import { Cursor } from './Cursor';
import Formula from './Formula';

export function clearCanvas(
	context: CanvasRenderingContext2D,
	fontSize: number,
): UpdateFunction {
	return function clear() {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.font = `${fontSize}px serif`;
	};
}

export function renderFormula(
	context: CanvasRenderingContext2D,
	formula: Formula,
) {
	return function render() {
		formula.render(context);
	};
}

export function renderCursor(
	context: CanvasRenderingContext2D,
	cursor: Cursor,
) {
	return function render() {
		if (cursor.isShown) {
			context.fillStyle = 'black';
			context.fillRect(
				cursor.xPosition,
				cursor.yPosition - 4,
				2,
				cursor.size + 2,
			);
		}
	};
}
