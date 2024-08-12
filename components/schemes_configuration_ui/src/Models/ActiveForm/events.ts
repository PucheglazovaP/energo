import { createEvent, merge } from 'effector';

import {
	FormLayer,
	FormTypes,
	ObjectValue,
	StatusIndicatorValue,
} from '../../Shared/types';

import { Form, FormBackground, TransparentEmergencyEventsCount } from './types';

export const setActiveFormParameters = createEvent<Partial<Form>>();
export const setActiveFormTitle = createEvent<string>();
export const setActiveFormType = createEvent<FormTypes>();
export const setFormBackground = createEvent<FormBackground>();
export const setFormObjectValue = createEvent<{
	objectId: number;
	objectValue: number | null;
	nulls: number;
	canerr: string;
}>();
export const setFormObjectsValue = createEvent<
	StatusIndicatorValue[] | ObjectValue[]
>();
export const setDynamicObjectImages = createEvent<
	{
		fileNumber: number;
		fileName: string;
		comment: string | null;
		url: string;
		objectId: number;
	}[]
>();
export const setTransparentSelectedStatus = createEvent<{
	objectId: number;
	isSelected: boolean;
}>();
export const setDynamicObjectImageUrl = createEvent<{
	url: string;
	fileName: string;
}>();
export const setDynamicObjectValue = createEvent<{
	objectId: number;
	objectValue: number | null;
}>();
export const resetActiveForm = createEvent();
export const fetchObjectValues = createEvent();

export const saveUserSettings = merge([setActiveFormParameters]);
export const setDateTime = createEvent<Date>();
export const setFormObjectEmergencyEventsCount =
	createEvent<TransparentEmergencyEventsCount>();
export const setEmegnecyEventsModeFlag = createEvent();

export const setDynamicObjectsLayerId = createEvent<
	{
		objectId: number;
		layerId: number;
	}[]
>();
export const setTransparentsLayerId = createEvent<
	{
		objectId: number;
		layerId: number;
	}[]
>();

export const setCheckedFormLayers = createEvent<number[]>();
export const changeCheckedFormLayers = createEvent<{
	id: number;
	isChecked: boolean;
}>();
export const setFormLayers = createEvent<FormLayer[]>();
export const setMainLayerInfo = createEvent<{ id: number; name: string }>();

export const setFullScreenMode = createEvent<boolean>();
export const setFormProportionsMode = createEvent<boolean>();
