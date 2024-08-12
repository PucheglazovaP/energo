import clsx from 'clsx';

import { useFormulaEditor } from '../../Hooks/FormulaEditor/useFormulaEditor';

import ButtonsBooleans from './ButtonsBooleans';
import ButtonsDate from './ButtonsDate';
import ButtonsFunctions from './ButtonsFunctions';
import ButtonsInputHistory from './ButtonsInputHistory';
import ButtonsSubmit from './ButtonsSubmit';
import ButtonsSystems from './ButtonsSystems';
import FormulaInput from './FormulaInput';
import { FormulaEditorProps } from './types';

import styles from './FormulaEditor.module.css';

function FormulaEditor({
	className,
	style,
	onSubmit,
	formula,
	onCancel,
	setFormulaInputHandler,
	onSelectFormulaElement,
	setFormulaText,
}: FormulaEditorProps) {
	const {
		rootFormulaRef,
		canvasRef,
		handleInputCharacter,
		editorRef,
		onUndo,
		onRedo,
		onClear,
	} = useFormulaEditor(formula, onSelectFormulaElement, setFormulaText);

	return (
		<div
			ref={rootFormulaRef}
			className={clsx(styles.root, className)}
			style={style}
		>
			<div className={styles.toolbar}>
				<ButtonsBooleans onClick={handleInputCharacter} />
				<div className={styles.separator} />
				<ButtonsFunctions onClick={handleInputCharacter} />
				<div className={styles.separator} />
				<ButtonsSystems onClick={handleInputCharacter} />
				<div className={styles.separator} />
				<ButtonsDate onClick={handleInputCharacter} />
				<div className={styles.separator} />
			</div>
			<div className={styles.body}>
				<div
					ref={editorRef}
					className={styles.editor}
					role="textbox"
					tabIndex={0}
					onKeyDown={(e) => {
						if (
							['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(
								e.key,
							)
						) {
							e.preventDefault();
						}
					}}
				>
					<canvas
						ref={canvasRef}
						tabIndex={0}
						className={styles.canvas}
						width={600}
					/>
				</div>
				<ButtonsInputHistory
					onClear={onClear}
					onUndo={onUndo}
					onRedo={onRedo}
					canUndo
					canRedo
				/>
			</div>
			<FormulaInput
				formulaText={formula}
				setFormulaInputHandler={setFormulaInputHandler}
			/>
			<ButtonsSubmit onSubmit={onSubmit} onCancel={onCancel} />
		</div>
	);
}

export default FormulaEditor;
