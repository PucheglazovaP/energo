import React from 'react';
import { useId } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableStrict from '../../DroppableStrict';
import { TableDndWrapperProps } from '../types';

function TableDndWrapper({
	children,
	onDragEnd = () => {},
	droppableId,
}: TableDndWrapperProps) {
	const id: string = useId();
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<DroppableStrict
				droppableId={droppableId ? droppableId : id}
				isDropDisabled={!droppableId}
			>
				{(provided) => (
					<tbody {...provided.droppableProps} ref={provided.innerRef}>
						{children}
						{provided.placeholder as React.ReactNode}
					</tbody>
				)}
			</DroppableStrict>
		</DragDropContext>
	);
}

export default TableDndWrapper;
