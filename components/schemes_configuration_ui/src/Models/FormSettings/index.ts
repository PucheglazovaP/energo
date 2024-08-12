import { createStore } from 'effector';

import { FormTypes } from '../../Shared/types';

import { disableEditMode, setFormSettings } from './events';
import { FormSettingsModel } from './types';

const initStore: FormSettingsModel = {
	formType: FormTypes.Form,
	isEditMode: false,
	activeId: null,
};

export const $formSettings = createStore<FormSettingsModel>(initStore);

$formSettings.on(setFormSettings, (state, formSettings) => ({
	...state,
	...formSettings,
}));

$formSettings.on(disableEditMode, (state) => ({
	...state,
	isEditMode: false,
	activeId: null,
}));
