import React from 'react';

import {
	DynamicObjectConfiguration,
	FormObject,
} from '../../../Shared/Types/formObject';

export type EditDynamicObjectProps = {
	className?: string;
	borderClassName?: string;
	objectValue: DynamicObjectConfiguration;
	handleClick?: (
		event: React.MouseEvent<SVGForeignObjectElement, MouseEvent>,
	) => void;
	isSelected: boolean;
	handleDragStart?: () => void;
	handleDragEnd?: (x: number, y: number) => void;
	handleResizeStart?: () => void;
	handleResizeEnd?: (
		x: number,
		y: number,
		width: number,
		height: number,
	) => void;
	isActionsDisabled?: boolean;
	onContextMenu?: (
		evt: React.MouseEvent,
		obj: DynamicObjectConfiguration,
	) => void;
};

export type DynamicObjectProps = {
	className?: string;
	objectValue: DynamicObjectConfiguration;
	handleClick?: () => void;
	onMouseMove?: (evt: React.MouseEvent, obj: FormObject) => void;
	onMouseLeave?: (evt: React.MouseEvent, obj: FormObject) => void;
};
