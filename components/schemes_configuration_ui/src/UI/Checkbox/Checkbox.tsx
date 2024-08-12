import { FC } from 'react';
import clsx from 'clsx';

import { CheckboxProps } from './types';

import styles from './Checkbox.module.css';

const Checkbox: FC<CheckboxProps> = ({
	className,
	classNameCheckmark,
	name,
	title,
	checked,
	disabled,
	onChange,
	style,
}) => {
	return (
		<label
			htmlFor={name}
			className={clsx(
				styles['root'],
				disabled && styles['disabled'],
				className,
			)}
			style={style}
		>
			{title}
			<input
				id={name}
				name={name}
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			<span className={clsx(styles['checkmark'], classNameCheckmark)} />
		</label>
	);
};

export default Checkbox;
