import React from 'react';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import {
	FormObjectParameters,
	FormParameters,
} from '../../Models/EditMode/types';
import { ConfigurationTypes } from '../../Shared/types';

export interface ConfigurationBlockProps {
	className?: string;
	style?: React.CSSProperties;
}
export interface IconAlignmentProps {
	className?: string;
	style?: React.CSSProperties;
}
export interface ConfigurationItemProps {
	item: FormParameters | FormObjectParameters;
}
export enum TooltipDirection {
	Up = 'up',
	Down = 'down',
	Right = 'right',
	Left = 'left',
}
export enum Parameters {
	X = 4975,
	Y = 4976,
	W = 4977,
	H = 4978,
	dX = 5019,
	dY = 5020,
	dW = 5018,
	dH = 4978,
}

export const CONFIGURATION_TYPES_LIST: SwitcherItemType[] = [
	{
		id: ConfigurationTypes.Inspector,
		title: 'Инспектор',
	},
	{
		id: ConfigurationTypes.Layers,
		title: 'Слои',
	},
];
