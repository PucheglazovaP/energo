import { useId } from 'react';
import clsx from 'clsx';

import { RadioButtonProps } from './types';

import styles from './RadioButton.module.css';

function RadioButton({
	className,
	disabled,
	checked,
	name,
	label,
	id,
	onChange,
	readOnly,
}: RadioButtonProps) {
	const genericId = useId();
	const fixedId = id || genericId;

	return (
		<label
			htmlFor={fixedId}
			className={clsx(styles.radio_button_container, className)}
		>
			<input
				type="radio"
				checked={checked}
				name={name}
				disabled={disabled}
				onChange={onChange}
				id={fixedId}
				className={styles.radio_button_input}
				readOnly={readOnly}
			/>
			<span className={styles.checkmark} />
			{label && <span className={styles.label}>{label}</span>}
		</label>
	);
}

export default RadioButton;
