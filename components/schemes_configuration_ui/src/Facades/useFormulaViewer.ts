import { useEffect, useMemo, useRef } from 'react';

import Editor from '../UI/FormulaEditor/Editor';
import Input from '../UI/FormulaEditor/Editor/Input';

export const useFormulaViewer = (
	formula?: string,
	onFormulaElementClick?: (element: string) => void,
	setFormulaText?: (formulaText: string) => void,
) => {
	const input: Input = useMemo(() => new Input(), []);
	const editor: Editor = useMemo(() => new Editor(input), [input]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef != null && canvasRef.current) {
			editor.registeredCanvasContext(
				canvasRef.current.getContext('2d')!,
				onFormulaElementClick,
				setFormulaText,
			);
			editor.run();
		}
		return () => {
			setFormulaText && setFormulaText('');
			editor.stop();
		};
	}, []);

	// Зависимость формулы от дополнительного инпута
	useEffect(() => {
		if (formula) editor.setFormulaText(formula);
	}, [formula]);

	return {
		canvasRef,
	};
};
