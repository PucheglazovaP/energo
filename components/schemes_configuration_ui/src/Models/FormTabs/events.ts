import { createEvent, merge } from 'effector';

import { FormTypes } from '../../Shared/types';
import { NavigationHistory } from '../NavigationHistory/types';

import { ChangeTab, FormTab } from './types';

export const copyTab = createEvent<{
	tabId: string;
	versionCode: number;
	userId: string;
}>();
export const deleteTab = createEvent<{
	tabId: string;
	versionCode: number;
	userId: string;
}>();
export const addTab = createEvent<{
	versionCode: number;
	url: string;
	id?: number;
	formType?: FormTypes;
	userId: string;
}>();
export const createFirstTab = createEvent();
export const saveUserSettings = createEvent<string>();
export const setUserSettings = createEvent<Partial<FormTab>>();
export const changeTab = createEvent<ChangeTab>();
export const saveNavigationHistory = createEvent<NavigationHistory>();

export const loadFormFromSelectedTab = merge([copyTab, deleteTab, changeTab]);

export const loadInfoFromActiveForm = createEvent();

export const updateTabRoute = createEvent<string>();
