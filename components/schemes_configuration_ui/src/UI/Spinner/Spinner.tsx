import React, { FC } from 'react';
import clsx from 'clsx';

import { SpinnerProps } from './types';

import styles from './Spinner.module.css';

const Spinner: FC<SpinnerProps> = ({ className }) => {
	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.spin} />
		</div>
	);
};

export default Spinner;
