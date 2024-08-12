import { useState } from 'react';
import clsx from 'clsx';

import { ParameterTooltipProps } from './types';

import styles from './Parameter.module.css';

function ParameterTooltip({
	className,
	style,
	text,
	children,
}: ParameterTooltipProps) {
	const [show, setShow] = useState(false);
	return (
		<div className={clsx(styles.tooltip_container, className)} style={style}>
			<div
				className={show ? clsx(styles.tooltip_box_visible) : styles.tooltip_box}
			>
				{text}
				{/* <span className={clsx(styles.tooltip_arrow)} /> */}
			</div>
			<div
				onMouseEnter={() => setShow(true)}
				onMouseLeave={() => setShow(false)}
			>
				{children}
			</div>
		</div>
	);
}
export default ParameterTooltip;
