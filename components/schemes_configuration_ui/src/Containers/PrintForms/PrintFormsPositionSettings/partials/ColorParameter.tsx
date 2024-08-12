import { ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../PrintFormsPositionSettings.module.css';

type ColorParameterProps = {
	title?: string;
	className?: string;
	children?: ReactNode;
};

function ColorParameter(props: ColorParameterProps) {
	const { title, className, children } = props;

	return (
		<div className={clsx(styles.color, className)}>
			<span className={styles.color__title}>{title}</span>
			<span className={styles.color__children}>{children}</span>
		</div>
	);
}

export default ColorParameter;
