import { createEvent } from 'effector';

import { FormTreeItem } from './types';

export const setFormTree = createEvent<{
	tree: FormTreeItem[];
	versionCode: number;
}>();
export const loadFirstForm = createEvent<{
	versionCode: number;
	userId: string;
}>();

export const getFormInfoById = createEvent<{
	formId: number;
	versionCode: number;
	userId: string;
}>();
export const setSelectedTreeItemState = createEvent<{
	id: number;
}>();

export const resetTree = createEvent();

export const loadForm = createEvent<{
	formId?: number;
	versionId: number;
	userId: string;
}>();
export const setTreeItemName = createEvent<{
	formId: number;
	newFormName: string;
}>();
export const updateFormOwner = createEvent<number>('Update form owner');
