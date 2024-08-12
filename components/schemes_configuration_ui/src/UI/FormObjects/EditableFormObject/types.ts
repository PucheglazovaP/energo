import React, { MutableRefObject } from 'react';

import { FormObjectConfiguration } from '../../../Shared/Types/formObject';

export enum ObjectTypes {
	Transparent = 'Транспарант',
	DynamicObject = 'Динамический объект',
	Series = 'Серия',
	StatusIndicator = 'Индикатор',
}

export type FormObjectProps = {
	className?: string;
	borderClassName?: string;
	object: FormObjectConfiguration;
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
	onContextMenu?: (evt: React.MouseEvent, obj: any) => void;
};

export type TransparentMap = Map<number, SVGForeignObjectElement>;
export type TransparentMapRef = MutableRefObject<TransparentMap>;

export type DynamicObjectMap = Map<number, SVGImageElement | SVGRectElement>;
export type DynamicObjectMapRef = MutableRefObject<DynamicObjectMap>;

export type ProviderValue = {
	transparents: TransparentMapRef;
	dynamicObjects: DynamicObjectMapRef;
};
