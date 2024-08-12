import { createStore, sample } from 'effector';
import { v4 as uuidv4 } from 'uuid';

import { FormTypes } from '../../Shared/types';
import { history } from '../../Utils/history';
import {
	resetActiveChannelChart,
	setActiveChannelChartParameters,
} from '../ActiveChannelChart/events';
import {
	resetActiveChart,
	setActiveChartParameters,
} from '../ActiveChart/events';
import { resetActiveForm, setActiveFormParameters } from '../ActiveForm/events';
import {
	setActiveFormId,
	setActiveVersionId,
	setNavigation,
} from '../Navigation/events';
import {
	resetNavigationHistory,
	setFormNavigationHistory,
} from '../NavigationHistory/events';
import { getFormInfoById, loadFirstForm } from '../TreeForms/events';

import {
	addTab,
	changeTab,
	copyTab,
	createFirstTab,
	deleteTab,
	loadFormFromSelectedTab,
	loadInfoFromActiveForm,
	saveNavigationHistory,
	setUserSettings,
	updateTabRoute,
} from './events';
import { ChangeTab, FormTab } from './types';

export const $formTabs = createStore<{
	selectedVersion: number;
	formTabs: Map<number, FormTab[]>;
}>({
	selectedVersion: 90,
	formTabs: new Map(),
});

$formTabs.watch(addTab, (state, { versionCode, url, userId }) => {
	resetActiveChart();
	resetActiveChannelChart();
	resetActiveForm();
	resetNavigationHistory();
	if (!url) {
		loadFirstForm({ versionCode, userId });
	}
});
$formTabs.on(addTab, (state, payload) => {
	const { url, id, formType } = payload;
	const uniqueId = uuidv4();
	const { selectedVersion, formTabs } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(selectedVersion);
	if (tabs) {
		const newTabs = [
			...tabs.map((item) => ({
				...item,
				isSelected: false,
			})),
			{
				title: `Закладка ${tabs.length + 1}`,
				isSelected: true,
				navigationHistory: [],
				formSettings: {},
				formId: id,
				tabId: uniqueId,
				url,
				formType,
			},
		];
		newFormTabs.set(selectedVersion, newTabs);
		return { ...state, formTabs: newFormTabs };
	}
});
$formTabs.on(createFirstTab, (state) => {
	const { selectedVersion, formTabs } = state;
	const uniqueId = uuidv4();
	const newFormTabs = new Map(formTabs);

	newFormTabs.set(selectedVersion, [
		{
			title: `Закладка 1`,
			isSelected: true,
			navigationHistory: [],
			formSettings: {},
			formId: undefined,
			tabId: uniqueId,
			url: '',
		},
	]);
	return { ...state, formTabs: newFormTabs };
});

$formTabs.on(copyTab, (state, { tabId }) => {
	const { selectedVersion, formTabs } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(selectedVersion);
	const uniqueId = uuidv4();
	if (tabs) {
		const selectedTab = tabs.find((item) => item.tabId === tabId);
		if (selectedTab) {
			const newTabs = [
				...tabs.map((item) => ({
					...item,
					isSelected: false,
				})),
				{
					...selectedTab,
					title: `${selectedTab.title} (Copy)`,
					isSelected: true,
					tabId: uniqueId,
				},
			];
			newFormTabs.set(selectedVersion, newTabs);
		}
		return { ...state, formTabs: newFormTabs };
	}
});
$formTabs.on(deleteTab, (state, { tabId }) => {
	const { selectedVersion, formTabs } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(selectedVersion);
	if (tabs) {
		const newTabs = tabs
			.filter((item) => item.tabId !== tabId)
			.map((item, index, array) => ({
				...item,
				isSelected: index === array.length - 1,
			}));
		newFormTabs.set(selectedVersion, newTabs);
		return { ...state, formTabs: newFormTabs };
	}
});

$formTabs.on(changeTab, (state, { tabId, versionCode }) => {
	const { formTabs } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(versionCode);
	if (tabs) {
		const newTabs = tabs.map((item) => ({
			...item,
			isSelected: item.tabId === tabId,
		}));
		newFormTabs.set(versionCode, newTabs);
	}
	return { ...state, formTabs: newFormTabs };
});
$formTabs.watch(changeTab, (state) => {
	const { formTabs, selectedVersion } = state;
	const tabs = formTabs.get(selectedVersion);
	if (tabs) {
		const selectedTab = tabs.find((item) => item.isSelected);
		if (selectedTab) {
			resetActiveChart();
			resetActiveChannelChart();
			resetActiveForm();
			resetNavigationHistory();
		}
	}
});
$formTabs.watch(loadFormFromSelectedTab, (state, { userId }) => {
	const { selectedVersion, formTabs } = state;
	const tabs = formTabs.get(selectedVersion);
	if (tabs) {
		const selectedTab = tabs.find((item) => item.isSelected);

		if (selectedTab && selectedTab.formId) {
			setFormNavigationHistory(selectedTab.navigationHistory);
			switch (selectedTab.formType) {
				case FormTypes.DiagnosticForm: {
					getFormInfoById({
						formId: selectedTab.formId,
						versionCode: selectedVersion,
						userId,
					});
					break;
				}
				case FormTypes.Form: {
					getFormInfoById({
						formId: selectedTab.formId,
						versionCode: selectedVersion,
						userId,
					});
					setActiveFormParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateFormEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.ActivePowerForm:
				case FormTypes.ReportForm: {
					getFormInfoById({
						formId: selectedTab.formId,
						versionCode: selectedVersion,
						userId,
					});
					setActiveFormParameters({
						...selectedTab,
						...selectedTab.formSettings,
					});
					break;
				}
				case FormTypes.Chart: {
					getFormInfoById({
						formId: selectedTab.formId,
						versionCode: selectedVersion,
						userId,
					});
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.MultiChart: {
					getFormInfoById({
						formId: selectedTab.formId,
						versionCode: selectedVersion,
						userId,
					});
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.DeviceChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.ChannelChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
			}
		}
	}
});

$formTabs.on(setUserSettings, (state, info) => {
	const { selectedVersion, formTabs } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(selectedVersion);
	if (tabs) {
		const newTabs = tabs.map((item) => {
			if (item.isSelected) {
				return {
					...item,
					...info,
					formSettings: { ...item.formSettings, ...info.formSettings },
				};
			}
			return item;
		});
		newFormTabs.set(selectedVersion, newTabs);
		return { ...state, formTabs: newFormTabs };
	}
});
$formTabs.on(saveNavigationHistory, (state, history) => {
	const { formTabs, selectedVersion } = state;
	const newFormTabs = new Map(formTabs);
	const tabs = newFormTabs.get(selectedVersion);
	if (tabs) {
		const newTabs = tabs.map((item) => {
			if (item.isSelected) {
				switch (item.formType) {
					case FormTypes.DeviceChart: {
						return { ...item, navigationHistory: [...history.devices] };
					}
					case FormTypes.ChannelChart: {
						return { ...item, navigationHistory: [...history.channels] };
					}
					default: {
						return { ...item, navigationHistory: [...history.form] };
					}
				}
			}
			return item;
		});
		newFormTabs.set(selectedVersion, newTabs);
		return {
			...state,
			formTabs: newFormTabs,
		};
	}
});
$formTabs.on(setNavigation, (state, { versionId }) => {
	if (versionId)
		return {
			...state,
			selectedVersion: versionId,
		};
});
$formTabs.on(setActiveVersionId, (state, id) => {
	const versionCode = id;
	return {
		...state,
		selectedVersion: versionCode,
	};
});

$formTabs.watch(setNavigation, async (state) => {
	const { formTabs, selectedVersion } = state;
	const tabsWithSelectedVersion = formTabs.get(selectedVersion);
	if (!tabsWithSelectedVersion) {
		createFirstTab();
	} else {
		const selectedTab = tabsWithSelectedVersion.find((item) => item.isSelected);
		if (selectedTab && selectedTab.formId) {
			switch (selectedTab.formType) {
				case FormTypes.Form: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveFormParameters({
						/* 						...selectedTab, */
						...selectedTab.formSettings,
						isUpdateFormEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.Chart: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.MultiChart: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.DeviceChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.ChannelChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
			}
		}
	}
});
$formTabs.watch(setActiveVersionId, async (state) => {
	const { formTabs, selectedVersion } = state;
	const tabsWithSelectedVersion = formTabs.get(selectedVersion);
	if (!tabsWithSelectedVersion) {
		setActiveFormId(undefined);
		createFirstTab();
		loadInfoFromActiveForm();
	} else {
		const selectedTab = tabsWithSelectedVersion.find((item) => item.isSelected);
		if (selectedTab && selectedTab.formId) {
			setActiveFormId(selectedTab.formId);
			switch (selectedTab.formType) {
				case FormTypes.Form: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveFormParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateFormEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.ActivePowerForm:
				case FormTypes.ReportForm: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveFormParameters({
						...selectedTab,
						...selectedTab.formSettings,
					});
					break;
				}
				case FormTypes.Chart: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.MultiChart: {
					setFormNavigationHistory(selectedTab.navigationHistory);
					setActiveChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.DeviceChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
				case FormTypes.ChannelChart: {
					setActiveChannelChartParameters({
						...selectedTab,
						...selectedTab.formSettings,
						isUpdateChartEnabled: selectedTab.formSettings.isUpdateEnabled,
					});
					break;
				}
			}
		}
	}
});

$formTabs.on(updateTabRoute, (state, route) => {
	const { selectedVersion, formTabs } = state;
	const tabsByVersion = formTabs.get(selectedVersion);
	if (!tabsByVersion) {
		return state;
	}
	const selectedTab = tabsByVersion.find((tab) => tab.isSelected);
	if (!selectedTab) {
		return state;
	}
	const newTab = { ...selectedTab, url: route };
	const newTabsByVersion = tabsByVersion.map((tab) => {
		if (tab.tabId === newTab.tabId) {
			return newTab;
		}
		return tab;
	});
	const newTabs = new Map(formTabs);
	newTabs.set(selectedVersion, newTabsByVersion);
	return {
		...state,
		formTabs: newTabs,
	};
});

// change tab on newly added (if url provided)
sample({
	clock: addTab,
	source: $formTabs,
	filter: (_src, clk) => {
		const { url } = clk;
		return !!url;
	},
	fn: (src, clk) => {
		const { formTabs, selectedVersion } = src;
		const { userId } = clk;
		const tabsByVersion: FormTab[] | undefined = formTabs.get(selectedVersion);
		if (!tabsByVersion) {
			return {} as ChangeTab;
		}
		const formTab: FormTab = tabsByVersion[tabsByVersion.length - 1];
		return { tabId: formTab.tabId, versionCode: selectedVersion, userId };
	},
	target: changeTab,
});

// Navigate to the changed tab
sample({
	clock: changeTab,
	source: $formTabs,
	fn: (src, clk) => {
		const { selectedVersion, formTabs } = src;
		const tabsByVersion: FormTab[] | undefined = formTabs.get(selectedVersion);
		if (!tabsByVersion) {
			return;
		}
		const formTab: FormTab | undefined = tabsByVersion.find(
			(tab) => tab.tabId === clk.tabId,
		);
		if (!formTab) {
			return;
		}
		if (history.navigate) {
			history.navigate?.(formTab.url);
		}
	},
});
