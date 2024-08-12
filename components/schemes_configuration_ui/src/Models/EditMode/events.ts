import { createEvent } from 'effector';
import { XrangePointOptionsObject } from 'highcharts';

import { ConfigurationTypes, FormTypes } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	DynamicObjectValue,
	FormObjectConfiguration,
	ObjectTypes,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { TreeItem } from '../../UI/Tree/types';

import {
	CreatedStatusIndicator,
	EditMode,
	FormObjectParameters,
	ObjectConfigTreeOpenState,
	UpdateObjectWithParameters,
} from './types';

export const setEditMode = createEvent<boolean>();
export const setDataForEditing = createEvent<Partial<EditMode>>();
export const setObjectParameters = createEvent<{
	objectId: number;
	parameters: FormObjectParameters[];
}>();
export const deleteObjectParameters = createEvent<number>();
export const setFormSelectedStatus = createEvent<boolean>();
export const setObjectSelectedStatus = createEvent<{
	objectId: number;
	isMultipleSelection: boolean;
}>();
export const resetSelection = createEvent();
export const reset = createEvent();
export const updateFormParameter = createEvent<{
	value: string | number;
	parameterCode: number;
	formId: number;
	parameterName: string;
	versionCode: number;
	pairedParameterName?: string;
	pairedParameterValue?: string | number | null;
}>();
export const updateObjectParameter = createEvent<{
	objectId: number;
	value: string | number | null;
	parameterCode?: number;
	parameterName: string;
	versionCode: number;
	pairedParameterName?: string;
	pairedParameterValue?: string | number | null;
}>();

export const setCreateTransparentMode = createEvent();
export const setCreateStatusIndicatorMode = createEvent();

export const alignItems: any = createEvent<{
	value: any;
	parameterCodeType: any;
	iId: any;
	item: any;
	versionCode: any;
}>();

export const setMultipleSelectedObjects = createEvent();

export const createTransparent = createEvent<{
	x: number;
	y: number;
	userId: string;
}>();
export const addCreatedTransparent = createEvent<{
	objectParameters: FormObjectParameters[];
	createdTransparentId: number;
	transparentObject: Partial<TransparentConfiguration>;
}>();

export const setCreateDynamicObjectMode = createEvent();
export const createDynamicObject = createEvent<{
	x: number;
	y: number;
	userId: string;
}>();
export const createStatusIndicator = createEvent<{
	x: number;
	y: number;
	userId: string;
}>();
export const addStatusIndicator = createEvent<CreatedStatusIndicator>();

export const addCreatedDynamicObject = createEvent<{
	objectDynamicParameters: FormObjectParameters[];
	createdDynamicObjectId: number;
	dynamicObject: Partial<TransparentConfiguration>;
}>();

export const deleteTransparent = createEvent<number>();
export const deleteDynamicObject = createEvent<number>();
export const deleteStatusIndicator = createEvent<number>();
export const uploadImage = createEvent<{
	formId: number;
	fileName: string;
	image: string;
	parameterName: string;
	versionCode: number;
}>();

export const setHighlightingBanners = createEvent();
export const setSelectingDynamicObjects = createEvent();

export const setAlignmentObject = createEvent<string>();

export const updateCoordinate = createEvent<{
	value: number;
	objectId: number;
	typeCoord: string;
	typeObject: TransparentConfiguration | DynamicObjectConfiguration;
}>();

export const setShowSelectedDynamicObject =
	createEvent<(DynamicObjectConfiguration | TransparentConfiguration)[]>();

export const setShowSelectedTransparentObject =
	createEvent<(DynamicObjectConfiguration | TransparentConfiguration)[]>();

export const setDynamicObjectImages = createEvent<{
	id: number;
	images: DynamicObjectValue[];
}>();

export const changeFormType = createEvent<FormTypes>();
export const updateObjectsWithParameters =
	createEvent<UpdateObjectWithParameters>();
export const addChartPoints =
	createEvent<[number, XrangePointOptionsObject[]]>();
export const deleteChartPoints = createEvent<number>();

export const changeFormName = createEvent<{ name: string; userId: string }>();
export const setFormName = createEvent<string>();

export const fetchInfoForEditing = createEvent<{
	id: number;
	title: string;
	formType: FormTypes;
	versionCode: number;
}>();
export const setDynamicObjectsImages =
	createEvent<Array<DynamicObjectValue & { objectId: number }>>();
export const fetchChartInfo = createEvent<{
	id: number;
	title: string;
	formType: FormTypes;
	versionCode: number;
}>();

export const setConfigurationType = createEvent<ConfigurationTypes>();

export const setSelectedObjects = createEvent<FormObjectConfiguration[]>();

export const setHintMode = createEvent<boolean>();

export const setEditableParameterName = createEvent<string>();

export const resetEditFormData = createEvent();

export const setConfigTreeOpenState =
	createEvent<ObjectConfigTreeOpenState[]>();
export const setSelectedObjectConfig = createEvent<TreeItem[]>();
export const setConfigTreeItemOpenState = createEvent<{
	type: ObjectTypes | FormTypes;
	treeItem: TreeItem;
}>();
