import React from 'react';
import clsx from 'clsx';

import { PositionAxis } from '../../Shared/types';

import styles from './Divider.module.css';

type DividerProps = {
	position?: PositionAxis;
	className?: string;
};

function Divider(props: DividerProps) {
	const { className, position = PositionAxis.Vertical } = props;

	const positionClassName: string =
		position === PositionAxis.Vertical
			? styles.divider__vertical
			: styles.divider__horizontal;

	return (
		<span className={clsx(styles.root, positionClassName, className)}></span>
	);
}

export default Divider;
