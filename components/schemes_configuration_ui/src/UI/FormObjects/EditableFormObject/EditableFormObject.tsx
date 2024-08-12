import {
	DynamicObjectConfiguration,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../../Shared/Types/formObject';
import DynamicObject from '../DynamicObject/EditableDynamicObject';
import StatusIndicator from '../StatusIndicator/EditableStatusIndicator';
import Transparent from '../Transparent/EditableTransparent';

import { FormObjectProps, ObjectTypes } from './types';

function EditableFormObject({
	className,
	borderClassName,
	object,
	handleClick = () => {},
	isSelected,
	handleDragStart = () => {},
	handleResizeStart = () => {},
	handleDragEnd = () => {},
	handleResizeEnd = () => {},
	isActionsDisabled = false,
	onContextMenu,
}: FormObjectProps) {
	return (
		<>
			{object.objectType === ObjectTypes.Transparent && (
				<Transparent
					className={className}
					borderClassName={borderClassName}
					objectValue={object as TransparentConfiguration}
					handleClick={handleClick}
					isSelected={isSelected}
					handleDragStart={handleDragStart}
					handleResizeStart={handleResizeStart}
					isActionsDisabled={isActionsDisabled}
					handleDragEnd={handleDragEnd}
					handleResizeEnd={(x, y, width, height) => {
						handleResizeEnd(x, y, width, height);
					}}
					onContextMenu={onContextMenu}
				/>
			)}
			{object.objectType === ObjectTypes.DynamicObject && (
				<DynamicObject
					className={className}
					borderClassName={borderClassName}
					objectValue={object as DynamicObjectConfiguration}
					handleClick={handleClick}
					isSelected={isSelected}
					handleDragStart={handleDragStart}
					handleResizeStart={handleResizeStart}
					isActionsDisabled={isActionsDisabled}
					handleDragEnd={handleDragEnd}
					handleResizeEnd={(x, y, width, height) => {
						handleResizeEnd(x, y, width, height);
					}}
					onContextMenu={onContextMenu}
				/>
			)}
			{object.objectType === ObjectTypes.StatusIndicator && (
				<StatusIndicator
					onContextMenu={onContextMenu}
					handleClick={handleClick}
					isSelected={isSelected}
					objectValue={object as StatusIndicatorConfiguration}
				/>
			)}
		</>
	);
}

export default EditableFormObject;
