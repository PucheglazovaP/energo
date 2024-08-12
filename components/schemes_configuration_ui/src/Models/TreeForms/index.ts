import { toast } from 'react-toastify';
import { createStore, sample } from 'effector';

import { FormTypes } from '../../Shared/types';
import { resetActiveChannelChart } from '../ActiveChannelChart/events';
import { fetchFormObjectsFx } from '../ActiveChart/effects';
import { fetchChartInfo } from '../ActiveChart/events';
import {
	resetActiveChart,
	setActiveChartParameters,
} from '../ActiveChart/events';
import { fetchCondensateDrainChartInfo } from '../ActiveCondensateDrainChart/events';
import { fetchFormInfoFx } from '../ActiveForm/effects';
import {
	resetActiveForm,
	setActiveFormParameters,
	setActiveFormTitle,
	setActiveFormType,
} from '../ActiveForm/events';
import { setDynamicChartParameters } from '../DynamicChart/events';
import { changeFormNameFx } from '../EditMode/effects';
import { setDataForEditing } from '../EditMode/events';
import { setNavigation } from '../Navigation/events';

import { fetchFormTreeDataFx, publishFormFx } from './effects';
import {
	getFormInfoById,
	loadFirstForm,
	loadForm,
	resetTree,
	setFormTree,
	setSelectedTreeItemState,
	setTreeItemName,
	updateFormOwner,
} from './events';
import { FormTreeItem } from './types';

export const $treeForms = createStore<FormTreeItem[]>([]);

$treeForms.on(setFormTree, (state, payload) => payload.tree);
$treeForms.reset(resetTree);

$treeForms.watch(loadFirstForm, (tree, { versionCode, userId }) => {
	if (tree.length && tree[0]?.id)
		getFormInfoById({
			formId: tree[0].id,
			versionCode: versionCode,
			userId,
		});
});

$treeForms.on(setTreeItemName, (tree, payload) => {
	const newTreeItem = [...tree];
	const treeItemIndex = newTreeItem.findIndex(
		(item) => item.id === payload.formId,
	);
	if (treeItemIndex >= 0)
		newTreeItem[treeItemIndex] = {
			...newTreeItem[treeItemIndex],
			displayName: payload.newFormName,
		};

	return newTreeItem;
});

$treeForms.on(updateFormOwner, (state, formId) =>
	state.map((form) => {
		if (form.id === formId) {
			return {
				...form,
				hasOwner: false,
			};
		}
		return form;
	}),
);

$treeForms.watch(getFormInfoById, (tree, payload) => {
	const { formId: id, versionCode, userId } = payload;
	const treeItem = tree.find((item) => item.id === id);
	resetActiveChart();
	resetActiveForm();
	resetActiveChannelChart();
	setDynamicChartParameters({ chartData: [] });
	if (treeItem) {
		setDataForEditing({
			formType: treeItem.formType,
			id,
		});
		setSelectedTreeItemState({ id });
		switch (treeItem.formType) {
			case FormTypes.Form:
			case FormTypes.DiagnosticForm: {
				setActiveFormParameters({ isLoading: true });
				fetchFormInfoFx({
					id,
					title: treeItem.displayName,
					formType: treeItem.formType,
					versionCode,
					userId,
				});
				break;
			}
			case FormTypes.ActivePowerForm:
			case FormTypes.ReportForm: {
				setActiveFormParameters({
					isLoading: false,
					id,
					title: treeItem.displayName,
					formType: treeItem.formType,
				});
				setActiveFormType(treeItem.formType);
				setActiveFormTitle(treeItem.displayName);
				break;
			}
			case FormTypes.Chart: {
				setActiveChartParameters({ isLoading: true });
				fetchChartInfo({
					id,
					title: treeItem.displayName,
					formType: treeItem.formType,
					parentId: treeItem.parentId,
					versionCode,
					userId,
					typesStorage: treeItem.typesStorage,
				});
				break;
			}
			case FormTypes.MultiChart: {
				setActiveChartParameters({ isLoading: true });
				fetchChartInfo({
					id,
					title: treeItem.displayName,
					formType: treeItem.formType,
					parentId: treeItem.parentId,
					versionCode,
					userId,
					typesStorage: treeItem.typesStorage,
				});
				fetchFormObjectsFx({ formId: id, versionCode });
				break;
			}
			case FormTypes.CondensateDrainForm: {
				fetchCondensateDrainChartInfo({
					id,
					title: treeItem.displayName,
					formType: treeItem.formType,
					versionCode,
					userId,
				});
				break;
			}
		}
	} else {
		setActiveFormParameters({ isLoading: false });
		setActiveChartParameters({ isLoading: false });
		toast.error('Формы с таким id не существует');
	}
});

loadForm.watch((payload) => {
	const { formId, versionId, userId } = payload;
	if (formId) {
		getFormInfoById({
			formId,
			versionCode: versionId,
			userId,
		});
	} else {
		loadFirstForm({ versionCode: versionId, userId });
	}
});

/* DECLARATIVES */
sample({
	clock: fetchFormTreeDataFx.doneData,
	fn: () => ({ diagnosticId: 144984 }),
	target: setNavigation,
});

sample({
	clock: changeFormNameFx.done,
	fn: (clockData) => {
		const {
			params: { newFormName, formId },
		} = clockData;
		return { formId, newFormName };
	},
	target: setTreeItemName,
});

// Update form owner when procedure is done
sample({
	clock: publishFormFx.doneData,
	target: updateFormOwner,
});
