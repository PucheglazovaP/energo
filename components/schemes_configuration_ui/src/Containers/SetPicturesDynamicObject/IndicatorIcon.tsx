import clsx from 'clsx';

import { indicatorIconProps } from './types';

import styles from './SetPicturesDynamicObject.module.css';

function IndicatorIcon({ className, style }: indicatorIconProps) {
	return (
		<div className={clsx(styles.icon_indicator, className)} style={style}>
			<svg
				width="7"
				height="7"
				viewBox="0 0 7 6"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="3.41406" cy="3" r="3" fill="#EB5757" />
			</svg>
		</div>
	);
}

export default IndicatorIcon;
