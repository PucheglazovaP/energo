import clsx from 'clsx';

import DroppableStrict from '../DroppableStrict';

import { TablePairDroppableWrapperProps } from './types';

import styles from './TablePair.module.css';

function TablePairDroppableWrapper(props: TablePairDroppableWrapperProps) {
	const { id, children, className, customStyle } = props;

	return (
		<DroppableStrict droppableId={id}>
			{(provided) => (
				<div
					className={clsx(styles.root, className)}
					style={customStyle}
					{...provided.droppableProps}
					ref={provided.innerRef}
				>
					{children}
					{provided.placeholder}
				</div>
			)}
		</DroppableStrict>
	);
}

export default TablePairDroppableWrapper;
