import { createEvent } from 'effector';

import {
	NSIUserParameter,
	NSIUserParameterDataType,
	NSIUserParameterFilesListItem,
	NSIUserParameterOption,
} from './types';

export const changeViewMode = createEvent<'read' | 'edit'>(
	'Change NSI parameters view mode',
);

export const changeDefaultParameters = createEvent<'actual' | 'static'>(
	'Change NSI default parameters',
);

export const setUserParametersList = createEvent<NSIUserParameter[]>(
	'Set NSI user parameters list',
);

export const updateUserParametersList = createEvent<NSIUserParameter>(
	'Update NSI user parameters list',
);

export const addUserParameter = createEvent<NSIUserParameter>(
	'Add NSI user parameter',
);

export const changeUserParameterName = createEvent<{
	id: number;
	name: string;
}>('Change NSI user parameter name');

export const changeUserParameterDataType = createEvent<{
	id: number;
	dataTypeId: number;
	dataType: string;
}>('Change NSI user parameter data type');

export const changeUserParameterComment = createEvent<{
	id: number;
	comment: string;
}>('Change NSI user parameter comment');

export const changeUserParameterValue = createEvent<
	Pick<NSIUserParameter, 'id' | 'value'>
>('Change NSI user parameter value');

export const deleteUserParameter = createEvent<number>(
	'Delete NSI user parameter',
);

export const setSelectedListId = createEvent<number>(
	'Set NSI selected list type parameter id',
);

export const switchUserParameterExpandedState = createEvent<number>(
	'Switch NSI user parameter expanded state',
);

export const switchAllUserParametersExpandedState = createEvent(
	'Switch all NSI user parameters expanded state',
);

export const restoreUserParametersList = createEvent(
	'Restore NSI user parameters list',
);

export const setUserParameterOptions = createEvent<{
	parameterId: number;
	options: NSIUserParameterOption[];
}>('Set NSI user parameter options');

export const addUserParameterOption = createEvent<number>(
	'Add NSI user parameter option',
);

export const changeUserParameterOption = createEvent<{
	parameterId: number;
	valueId: number;
	value: string;
}>('Change NSI user parameter option');

export const deleteUserParameterOption = createEvent<{
	parameterId: number;
	valueId: number;
}>('Delete NSI user parameter option');

export const restoreUserParameterOptions = createEvent<number>(
	'Restore NSI user parameter options',
);

export const resetUserParameterOptionsModel = createEvent(
	'Reset NSI user parameter options model',
);

export const setUserParameterFilesList = createEvent<{
	valueId: number;
	files: NSIUserParameterFilesListItem[];
}>('Set NSI user parameter files list');

export const switchFileCheckedState = createEvent<{
	valueId: number;
	fileId: number;
}>('Switch NSI file checked state');

export const setAllFilesCheckedState = createEvent<{
	valueId: number;
	checked: boolean;
}>('Set all NSI files checked state');

export const resetUserParameterFilesListModel = createEvent(
	'Reset NSI user parameter files list model',
);

export const setUserParameterDataTypes = createEvent<
	NSIUserParameterDataType[]
>('Set NSI user parameter data types');
