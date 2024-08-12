import { DataTabsElem } from '../Components/FormulaEditor/types';
import {
	CREATE_DEVICE,
	CREATE_DEVICES,
	CREATE_GROUP_COPY,
	CREATE_GROUP_FROM_CHANNELS,
	CREATE_GROUPS,
	CREATE_GROUPS_FROM_CHANNELS,
	CREATE_NEW_CHANNELS,
	DELETE_GROUP,
	INCLUDE_CHANNELS_TO_GROUP,
	INCLUDE_UNUSED_CHANNELS_TO_GROUP,
	UPDATE_CHANNEL,
	UPDATE_CHANNEL_COEFFICIENT,
	UPDATE_DEVICE,
	UPDATE_GROUP,
	UPDATE_UNUSED_CHANNEL,
} from '../Const/parametersBlock';

import { PreferenceType } from './PreferenceTypes';
import { UnitsTreeItem } from './UnitsTreeTypes';

export interface ParamsList {
	placeholder?: string | DataTabsElem;
	canCopy?: boolean;
	value: string | number;
	title?: string;
	dropdown?: boolean;
	isTree?: boolean;
	options?: PreferenceType[] | UnitsTreeItem[];
	header?: string;
	id?: string;
	listItems?: number[];
	withUnderLine?: boolean;
	readOnly?: boolean;
	needRenderAddButton?: boolean;
	onAddClick?: (string: string) => () => void;
	isCalendar?: boolean;
	className?: string;
}
export interface ParamItem {
	header: string;
	placeholder?: string;
	value: string | number;
}

export interface ParamsBlock {
	header: string;
	sortParams: ParamsList[];
}

export type OperationType =
	| typeof CREATE_GROUPS
	| typeof CREATE_GROUP_COPY
	| typeof UPDATE_GROUP
	| typeof DELETE_GROUP
	| typeof CREATE_DEVICE
	| typeof CREATE_DEVICES
	| typeof UPDATE_DEVICE
	| typeof INCLUDE_CHANNELS_TO_GROUP
	| typeof UPDATE_CHANNEL
	| typeof CREATE_NEW_CHANNELS
	| typeof CREATE_GROUPS_FROM_CHANNELS
	| typeof CREATE_GROUP_FROM_CHANNELS
	| typeof UPDATE_CHANNEL_COEFFICIENT
	| typeof UPDATE_UNUSED_CHANNEL
	| typeof INCLUDE_UNUSED_CHANNELS_TO_GROUP;
