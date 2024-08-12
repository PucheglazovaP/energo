import { createStore, sample } from 'effector';

import { FormTypes, TreeTypes } from '../../Shared/types';
import {
	resetActiveChannelChart,
	setActiveChannelChartTitle,
	setActiveChannelChartType,
} from '../ActiveChannelChart/events';
import {
	resetActiveChart,
	setActiveChartTitle,
	setActiveChartType,
} from '../ActiveChart/events';
import {
	setActiveCondensateDrainChartTitle,
	setActiveCondensateDrainChartType,
} from '../ActiveCondensateDrainChart/events';
import {
	resetActiveForm,
	setActiveFormTitle,
	setActiveFormType,
} from '../ActiveForm/events';
import { resetNavigationHistory } from '../NavigationHistory/events';
import { changeType } from '../Sidebar/events';
import { fetchFormTreeDataFx } from '../TreeForms/effects';
import { resetTree, setSelectedTreeItemState } from '../TreeForms/events';

import {
	setActiveFormId,
	setActiveVersionId,
	setDiagnosticId,
	setNavigation,
} from './events';
import { NavigationModel } from './types';

const initState: NavigationModel = {
	versionId: undefined,
	formId: undefined,
	treeType: TreeTypes.Mnemoschemes,
	deviceId: undefined,
	serverId: undefined,
	channelId: undefined,
	nodeId: undefined,
	nodeItemId: undefined,
	activeFormType: FormTypes.Form,
	activeFormName: '',
	diagnosticId: undefined,
};

export const $navigation = createStore<NavigationModel>(initState);

$navigation.on(setNavigation, (state, navigation) => ({
	...state,
	...navigation,
}));

$navigation.on(setActiveVersionId, (state, versionId) => ({
	...state,
	versionId,
}));

$navigation.on(setActiveFormId, (state, formId) => ({
	...state,
	formId,
}));

setActiveVersionId.watch(() => {
	resetActiveChart();
	resetActiveChannelChart();
	resetActiveForm();
	resetTree();
	resetNavigationHistory();
});

$navigation.on(changeType, (state, type) => {
	return {
		...state,
		treeType: type,
	};
});
$navigation.on(setSelectedTreeItemState, (state, { id }) => {
	return {
		...state,
		formId: id,
	};
});

$navigation.on(setActiveFormTitle, (state, title) => {
	return {
		...state,
		activeFormName: title,
	};
});
$navigation.on(setActiveFormType, (state, formType) => {
	return {
		...state,
		activeFormType: formType,
	};
});
$navigation.on(setActiveChartTitle, (state, title) => {
	return {
		...state,
		activeFormName: title,
	};
});
$navigation.on(setActiveChartType, (state, formType) => {
	return {
		...state,
		activeFormType: formType,
	};
});
$navigation.on(setActiveChannelChartTitle, (state, title) => {
	return {
		...state,
		activeFormName: title,
	};
});
$navigation.on(setActiveChannelChartType, (state, formType) => {
	return {
		...state,
		activeFormType: formType,
	};
});
$navigation.on(setActiveCondensateDrainChartTitle, (state, title) => {
	return {
		...state,
		activeFormName: title,
	};
});
$navigation.on(setActiveCondensateDrainChartType, (state, formType) => {
	return {
		...state,
		activeFormType: formType,
	};
});
$navigation.on(setDiagnosticId, (state, id) => ({
	...state,
	diagnosticId: id,
}));

/* DECLARATIVES */

// Change diagnostic id when tree data is loaded
sample({
	clock: fetchFormTreeDataFx.doneData,
	fn: (clk) => clk.diagnosticId,
	target: setDiagnosticId,
});
