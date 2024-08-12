import { FormulaInputProps } from './types';

import styles from './FormulaEditor.module.css';

function FormulaInput({
	formulaText,
	setFormulaInputHandler,
}: FormulaInputProps) {
	return (
		<input
			className={styles.formula_input}
			type="text"
			value={formulaText}
			onInput={setFormulaInputHandler}
		/>
	);
}

export default FormulaInput;
