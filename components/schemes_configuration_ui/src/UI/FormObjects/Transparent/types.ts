import React from 'react';

import {
	FormObject,
	TransparentConfiguration,
} from '../../../Shared/Types/formObject';

export enum ParametersValue {
	Center = 'middle',
	Left = 'start',
	Right = 'end',
	Top = 'start',
	Bottom = 'end',
}

export type EditTransparentProps = {
	className?: string;
	borderClassName?: string;
	objectValue: TransparentConfiguration;
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
		obj: TransparentConfiguration,
	) => void;
};

export type TransparentProps = {
	className?: string;
	objectValue: TransparentConfiguration;
	handleClick?: () => void;
	handleSelect?: (checked: boolean) => void;
	isSelected?: boolean;
	validate?: (transparentData: TransparentConfiguration) => {
		textColor: string;
		backgroundColor: string;
	};
	onContextMenu?: (evt: React.MouseEvent, obj: FormObject) => void;
	onMouseMove?: (evt: React.MouseEvent, obj: FormObject) => void;
	onMouseLeave?: (evt: React.MouseEvent, obj: FormObject) => void;
	onEmergencyButtonClick?: (obj: FormObject) => void;
	isEmergencyEventsModeEnabled?: boolean;
};
