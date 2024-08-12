import { createEvent } from 'effector';

import { SelectOption } from '../../UI/Select/types';

import {
	GroupInfo,
	ParameterOperation,
	ResponsiblePersons,
	SelectGroupType,
} from './types';

export const setName = createEvent<string>();
export const setResponsiblePersonsList = createEvent<ResponsiblePersons[]>();
export const setAssignedResponsiblePersonsList =
	createEvent<ResponsiblePersons[]>();
export const setResponsiblePersonsListIsLoading = createEvent<boolean>();
export const setGroupNumberInfo = createEvent<GroupInfo>();
export const setSelectGroupType = createEvent<SelectGroupType>();
export const setSelectedParameterId = createEvent<number>();
export const setSelectedParameterParentId = createEvent<number | null>();
export const addResponsiblePerson = createEvent();
export const deleteResponsiblePerson = createEvent<number>();
export const changeResponsiblePerson = createEvent<{
	options: ResponsiblePersons[];
	personNumber: number;
}>();
export const setControlParameterFlag = createEvent<boolean>();
export const setNewPosition = createEvent<string>();
export const setOperation = createEvent<ParameterOperation>();
export const setInfoForEditing = createEvent<{
	name: string;
	controlGroupNumber: number | null;
	dynamicObjectGroupNumber: number | null;
	lastModified: string;
	unitId: number | null;
	dataTypeCode: number | null;
}>();
export const saveNewParameter = createEvent<string>();
export const saveParameter = createEvent<string>();
export const resetParameterCreationData = createEvent();
export const setControlGroupNumber = createEvent<number | null>();
export const setDynamicObjectGroupNumber = createEvent<number | null>();
export const setDataTypeList = createEvent<SelectOption[]>();
