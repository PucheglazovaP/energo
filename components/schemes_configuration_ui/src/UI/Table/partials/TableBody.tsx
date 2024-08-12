import { TableBodyProps } from '../types';

import TableRow from './TableRow';

function TableBody({
	headers,
	data,
	depthLevel,
	isDotVisible,
	isDraggable = false,
	activeIndex,
}: TableBodyProps) {
	return (
		<>
			{data.map((row, index) => (
				<TableRow
					key={`row-${index}`}
					isDraggable={isDraggable}
					headers={headers}
					row={row}
					rowIndex={index}
					depthLevel={depthLevel}
					isDotVisible={isDotVisible}
					activeIndex={activeIndex}
				/>
			))}
		</>
	);
}

export default TableBody;
