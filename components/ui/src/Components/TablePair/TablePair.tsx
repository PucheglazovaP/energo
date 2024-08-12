import { ForwardedRef, forwardRef } from 'react';
import clsx from 'clsx';

import TableRowGroup from './TableRowGroup';
import { TableCell, TablePairProps } from './types';

import styles from './TablePair.module.css';

function TablePair(
	{
		className,
		style,
		data,
		captions = [],
		firstRowAsHeader = true,
		areRowSelected,
	}: TablePairProps,
	ref: ForwardedRef<HTMLDivElement>,
) {
	const [sampleGroup = []] = data;
	const [sampleRow = []] = sampleGroup;
	const columnsCount = Math.max(1, sampleRow.length);

	const dataWithoutGroups: TableCell[][] = data.flat();

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div
				ref={ref}
				className={styles.body}
				style={{
					gridTemplateColumns: `repeat(${columnsCount}, auto)`,
				}}
			>
				{data.map((dataGroup, groupIndex) => (
					<TableRowGroup
						data={dataGroup}
						key={groupIndex}
						firstRowAsHeader={firstRowAsHeader}
						caption={captions[groupIndex]}
						areRowSelected={areRowSelected}
						allRows={dataWithoutGroups}
					/>
				))}
			</div>
		</div>
	);
}

export default forwardRef(TablePair);
