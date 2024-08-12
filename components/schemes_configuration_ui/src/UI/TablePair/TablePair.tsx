import React, { ForwardedRef, forwardRef } from 'react';

import TablePairDroppableWrapper from './TablePairDroppableWrapper';
import TablePairNotDroppableWrapper from './TablePairNotDroppableWrapper';
import TableRowGroup from './TableRowGroup';
import { TableCell, TablePairProps } from './types';

function TablePair(
	{
		className,
		style,
		data,
		captions = [],
		firstRowAsHeader = true,
		areRowSelected,
		isDraggable,
		draggableId = '',
	}: TablePairProps,
	ref: ForwardedRef<HTMLDivElement>,
) {
	const [sampleGroup = []] = data;
	const [sampleRow = []] = sampleGroup;
	const columnsCount = Math.max(1, sampleRow.length);

	const dataWithoutGroups: TableCell[][] = data.flat();

	const tableStyles: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: `repeat(${columnsCount}, auto)`,
	};

	const Wrapper = isDraggable
		? TablePairDroppableWrapper
		: TablePairNotDroppableWrapper;

	return (
		<Wrapper className={className} customStyle={style} id={draggableId}>
			<div ref={ref} style={!isDraggable ? tableStyles : undefined}>
				{data.map((dataGroup, groupIndex) => (
					<TableRowGroup
						data={dataGroup}
						key={groupIndex}
						firstRowAsHeader={firstRowAsHeader}
						caption={captions[groupIndex]}
						areRowSelected={areRowSelected}
						allRows={dataWithoutGroups}
						isDraggable={isDraggable}
					/>
				))}
			</div>
		</Wrapper>
	);
}

export default forwardRef(TablePair);
