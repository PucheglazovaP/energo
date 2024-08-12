import { Vector2D } from '../types';

export default function getMouseInCanvasPosition(
	originMousePosition: Vector2D,
	canvasDomRect: DOMRect,
): Vector2D {
	return {
		x: originMousePosition.x - canvasDomRect.left,
		y: originMousePosition.y - canvasDomRect.top,
	};
}
