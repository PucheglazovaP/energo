import React from 'react';

import { InputFormSelectOptions } from '../../Models/InputFormSelectOptions/types';

export enum InputPointType {
	Text = 'Text',
	Lookup = 'Lookup Get_DailyPointsDataTKDirections',
}

export enum InputType {
	Text = 'Text',
	Lookup = 'Lookup Get_DailyPointsAVGMethods',
}

export interface EditInputCellProps {
	id: string | number;
	type: string;
	name: string;
	value: string | number;
	options?: InputFormSelectOptions[];
	handleEditValue?: (
		value: string | number,
		name: string,
		rowId: string | number,
	) => void;
	onChange: (
		value: string | number,
		name: string,
		rowId: string | number,
	) => void;
	additionalCellStyles?: React.CSSProperties;
	additionalCellText?: string | number;
	withoutOnBlur?: boolean;
}
