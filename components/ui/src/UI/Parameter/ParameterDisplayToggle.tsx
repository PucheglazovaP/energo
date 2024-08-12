import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ParameterDisplayProps } from './types';

import styles from './Parameter.module.css';

function ParameterDisplayToggle({
	className,
	style,
	value,
	onClick,
}: ParameterDisplayProps) {
	const toggle = (checked: boolean) => {
		if (onClick) onClick(checked ? 'true' : 'false');
		setCheckedStatus(checked);
	};
	const [checked, setCheckedStatus] = useState(value === 'true');

	useEffect(() => {
		setCheckedStatus(value === 'true');
	}, [value]);

	return (
		<label
			className={clsx(styles.parameter_display_toggle, className)}
			style={style}
		>
			<input
				type="checkbox"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					toggle(e.target.checked);
				}}
				checked={checked}
			/>
		</label>
	);
}
export default ParameterDisplayToggle;
