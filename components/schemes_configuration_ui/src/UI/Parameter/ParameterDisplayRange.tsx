import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

import { ParameterDisplayProps } from './types';

import styles from './Parameter.module.css';

function ParameterDisplayRange({
	className,
	style,
	value,
	onChange,
}: ParameterDisplayProps) {
	const [rangeValue, setRangeValue] = useState(1);

	useMemo(() => {
		const result = value == null && value == '' ? 1 : value;
		setRangeValue(Number(result));
	}, [value]);

	const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRangeValue(Number(e.target.value));
		onChange && onChange(e);
	};

	return (
		<label
			className={clsx(
				value == null || value == ''
					? styles.parameter_display_range_multipleChoice
					: styles.parameter_display_range,
				className,
			)}
			style={style}
		>
			<input
				type="range"
				min={1}
				max={50}
				step={1}
				value={rangeValue}
				onChange={handleRangeChange}
			/>
			<p> {value == null && value == '' ? '' : value}</p>
		</label>
	);
}
export default ParameterDisplayRange;
