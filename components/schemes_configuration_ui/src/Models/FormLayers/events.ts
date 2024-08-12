import { createEvent } from 'effector';

import { Action, FormLayer, SystemLayer } from '../../Shared/types';

export const setSystemLayers = createEvent<SystemLayer[]>();
export const setFormLayers = createEvent<FormLayer[]>();
export const setCheckedSystemLayers = createEvent<number[]>();
export const setCheckedFormLayers = createEvent<number[]>();
export const changeCheckedSystemLayers = createEvent<{
	id: number;
	isChecked: boolean;
}>();
export const setReplacedFormLayerId = createEvent<number | null>();
export const setActiveFormLayer = createEvent<number | null>();
export const setSystemLayerActionType = createEvent<Action>();
export const setSystemLayerEditData = createEvent<SystemLayer | null>();
export const changeCheckedFormLayers = createEvent<{
	id: number;
	isChecked: boolean;
}>();
export const setMainLayerInfo = createEvent<{ id: number; name: string }>();
