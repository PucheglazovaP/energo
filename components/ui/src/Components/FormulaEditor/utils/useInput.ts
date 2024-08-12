import { useEffect } from 'react';

import { KeyboardFunction } from '../types';

export default function useKeyboardInput(
	handleKeyboardInput: KeyboardFunction,
	canvas: HTMLCanvasElement | null,
) {
	useEffect(() => {
		if (canvas != null) {
			canvas.addEventListener('keyup', handleKeyboardInput);
		}
		return () => {
			if (canvas != null) {
				canvas.removeEventListener('keyup', handleKeyboardInput);
			}
		};
	}, [handleKeyboardInput, canvas]);
}
