import clsx from 'clsx';

import { TablePairNotDroppableWrapperProps } from './types';

import styles from './TablePair.module.css';

function TablePairNotDroppableWrapper(
	props: TablePairNotDroppableWrapperProps,
) {
	const { className, customStyle, children } = props;
	return (
		<div className={clsx(styles.root, className)} style={customStyle}>
			{children}
		</div>
	);
}

export default TablePairNotDroppableWrapper;
