import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ParameterDisplayProps } from './types';

import styles from './Parameter.module.css';

/*
 * TODO: Refactor component from '0' - '1' etc... to logically boolean true and false
 */
function ParameterDisplayToggle({
	className,
	style,
	value,
	onClick,
}: ParameterDisplayProps) {
	const [multipleChoice, setMultipleChoice] = useState(false);
	const [checked, setCheckedStatus] = useState(
		value === '1' || value === 'true',
	);

	const toggle = (checked: boolean) => {
		if (onClick) onClick(checked ? '1' : '0');
		setCheckedStatus(checked);
	};
	const checkbox = (checked: string) => {
		if (onClick) onClick(checked === 'da' ? '1' : '0');
		if (checked === 'da') {
			setCheckedStatus(true);
		} else {
			setCheckedStatus(false);
		}
	};
	useEffect(() => {
		value == null ? setMultipleChoice(true) : setMultipleChoice(false);
	}, [value]);

	useEffect(() => {
		setCheckedStatus(value === '1' || value === 'true');
	}, [value]);

	return (
		<label
			className={clsx(styles.parameter_display_toggle, className)}
			style={style}
		>
			{multipleChoice ? (
				<select
					value={multipleChoice && 'undefined'}
					className={clsx(styles.select_checkbox)}
					onChange={(e) => {
						checkbox(e.target.value);
						setMultipleChoice(false);
					}}
				>
					<option value="undefined" hidden disabled>
						Неопределено
					</option>
					<option value="da">Да</option>
					<option value="net">Нет</option>
				</select>
			) : (
				<input
					type="checkbox"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						toggle(e.target.checked);
					}}
					checked={Boolean(Number(checked))}
				/>
			)}
		</label>
	);
}
export default ParameterDisplayToggle;
