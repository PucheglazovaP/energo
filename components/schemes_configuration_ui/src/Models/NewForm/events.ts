import { createEvent } from 'effector';

import {
	ParentRadioGroup,
	RadioGroup,
} from '../../Containers/FormCreation/types';

import { FormOperation, FormType } from './types';

export const setParents = createEvent<ParentRadioGroup[]>();
export const setPositions = createEvent<RadioGroup[]>();
export const onParentChange = createEvent<string>();
export const onPositionChange = createEvent<string>();
export const setPositionEnd = createEvent();
export const enablePositions = createEvent();
export const onNameChange = createEvent<string>();
export const setFormTypes = createEvent<FormType[]>();
export const clearFormTypes = createEvent();
export const setTypesIsLoading = createEvent<boolean>();
export const setFormOperation = createEvent<FormOperation>();
export const setCopiedId = createEvent<number>();
export const setCopiedIdChildrenFlag = createEvent<boolean>();
export const changeActiveFormType = createEvent<string | number>();
