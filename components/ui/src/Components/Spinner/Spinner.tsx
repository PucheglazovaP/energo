import { memo } from 'react';
import clsx from 'clsx';

import spinner from '../../Assets/images/Spinner.gif';

import { SpinnerProps } from './types';
import styles from './Spinner.module.scss';

function Spinner(props: SpinnerProps) {
	const { className } = props;
	const spinnerClassName = clsx(styles.spinner__img, className);

	return (
		<div className={styles.spinner}>
			<img src={spinner} alt="preload" className={spinnerClassName} />
		</div>
	);
}

export default memo(Spinner);
