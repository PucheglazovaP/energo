import { useCallback, useEffect, useMemo, useRef } from 'react';

import Editor from '../../Components/FormulaEditor/Editor';
import Input from '../../Components/FormulaEditor/Editor/Input';
import useKeyboardInput from '../../Components/FormulaEditor/utils/useInput';

export const useFormulaEditor = (
	formula?: string,
	onFormulaElementClick?: (element: string) => void,
	setFormulaText?: (formulaText: string) => void,
) => {
	const input: Input = useMemo(() => new Input(), []);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rootFormulaRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const editor: Editor = useMemo(
		() => new Editor(input, editorRef),
		[input, editorRef],
	);

	useKeyboardInput(input.keyupHandler.bind(input), canvasRef.current);

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

	// Формула основного инпута
	const formulaText = useMemo(() => {
		return editor.formula?.text;
	}, [editor.formula]);

	// Дублирование формулы в дополнительный инпут
	useEffect(() => {
		if (formulaText && setFormulaText) setFormulaText(formulaText);
		console.log('from effect', formulaText);
	}, [formulaText]);

	// Зависимость формулы от дополнительного инпута
	useEffect(() => {
		if (formula) {
			editor.setFormulaText(formula);
		} else {
			editor.setFormulaText('');
		}
	}, [formula]);

	// Посимвольное введение формулы
	const handleInputCharacter = useCallback((character: string) => {
		editor.insertCharacter(character);

		if (canvasRef.current != null) {
			canvasRef.current.focus();
		}
	}, []);

	const onUndo = useCallback(() => {
		editor.undo();
		setFormulaText && setFormulaText(editor.formula?.text!);
	}, [editor]);

	const onRedo = useCallback(() => {
		editor.redo();
		setFormulaText && setFormulaText(editor.formula?.text!);
	}, [editor]);

	const onClear = useCallback(() => {
		editor.setFormulaText('');
		setFormulaText && setFormulaText('');
	}, [editor]);

	return {
		rootFormulaRef,
		editorRef,
		canvasRef,
		handleInputCharacter,
		onUndo,
		onRedo,
		onClear,
	};
};
