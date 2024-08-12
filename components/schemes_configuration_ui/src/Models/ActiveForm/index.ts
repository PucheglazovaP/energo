import format from 'date-fns/format';
import { createStore, sample } from 'effector';

import { FormTypes, StatusIndicatorValue, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { DateFormat } from '../../Utils/dateUtils';
import {
	filterTreeById,
	removeNodeAndHisChildren,
} from '../../Utils/treeUtils';
import { $activeIds } from '../ActiveIds';
import { ActiveVersionIdsModel } from '../ActiveIds/types';
import { $user } from '../Auth';
import { setDataForEditing, setEditMode } from '../EditMode/events';
import { setUserSettings } from '../FormTabs/events';
import { getFormInfoById } from '../TreeForms/events';

import {
	fetchDynamicObjectsLayerIdFx,
	fetchFormObjectsValueByLayersFx,
	fetchObjectImageFx,
	fetchTransparentEmergencyEventsCountFx,
	fetchTransparentsLayerIdFx,
	getCurrentFormLayersFx,
	getSystemLayersFx,
} from './effects';
import {
	changeCheckedFormLayers,
	fetchObjectValues,
	resetActiveForm,
	saveUserSettings,
	setActiveFormParameters,
	setActiveFormTitle,
	setActiveFormType,
	setCheckedFormLayers,
	setDateTime,
	setDynamicObjectImages,
	setDynamicObjectImageUrl,
	setDynamicObjectsLayerId,
	setDynamicObjectValue,
	setEmegnecyEventsModeFlag,
	setFormLayers,
	setFormObjectEmergencyEventsCount,
	setFormObjectsValue,
	setFormObjectValue,
	setFormProportionsMode,
	setFullScreenMode,
	setMainLayerInfo,
	setTransparentSelectedStatus,
	setTransparentsLayerId,
} from './events';
import { ActiveFormLayers, Form } from './types';

const init: Form = {
	id: null,
	isTitleVisible: false,
	title: '',
	visdelayForm: 0,
	formType: FormTypes.Form,
	formTransparentObjects: [],
	formDynamicObjects: [],
	statusIndicators: [],
	formBackground: '',
	backgroundWidth: 0,
	backgroundHeight: 0,
	isLoading: true,
	trendMode: '-1',
	versionCode: 90,
	isUpdateFormEnabled: false,
	updateDelay: 60,
	dateTime: new Date(),
	isEmergencyEventsModeEnabled: true,
	isFullScreenModeEnabled: false,
	isFormProportionsSaved: true,
};
export const $activeForm = createStore<Form>(init);
export const $activeFormLayers = createStore<ActiveFormLayers>({
	formLayers: [],
	checkedFormLayers: [],
	mainLayer: {
		id: 1,
		name: 'Основной',
	},
});

$activeForm.on(resetActiveForm, (state) => ({
	...state,
	id: null,
	isTitleVisible: false,
	title: '',
	visdelayForm: 0,
	formType: FormTypes.Form,
	formTransparentObjects: [],
	formDynamicObjects: [],
	statusIndicators: [],
	formBackground: '',
	backgroundWidth: 0,
	backgroundHeight: 0,
	isLoading: true,
	trendMode: '-1',
	versionCode: 90,
	isEmergencyEventsModeEnabled: true,
}));
$activeForm.on(setDateTime, (state, payload) => {
	return {
		...state,
		dateTime: payload,
	};
});
$activeForm.on(setActiveFormParameters, (state, formParameters) => {
	return {
		...state,
		...formParameters,
	};
});

$activeForm.on(setFormObjectValue, (state, payload) => {
	const { objectId, objectValue, nulls, canerr } = payload;
	const newFormObjects = [...state.formTransparentObjects];
	const objectIndex = newFormObjects.findIndex((item) => item.id === objectId);
	newFormObjects[objectIndex] = {
		...newFormObjects[objectIndex],
		value: objectValue,
		nulls,
		canerr,
	};
	return {
		...state,
		formTransparentObjects: [...newFormObjects],
	};
});
$activeForm.on(setFormObjectsValue, (state, formObjectsData) => {
	const { formTransparentObjects, formDynamicObjects, statusIndicators } =
		state;
	const newDynamicObjects = formDynamicObjects.map((item) => {
		const formObjectValue = formObjectsData.find((i) => i.objectId === item.id);
		return {
			...item,
			selectedImageNumberFromGroup: formObjectValue?.objectValue || null,
		};
	});
	const newFormTransparentObjects = formTransparentObjects.map((item) => {
		const formObjectValue = formObjectsData.find((i) => i.objectId === item.id);
		return {
			...item,
			value:
				formObjectValue?.objectValue != null
					? Number(formObjectValue.objectValue.toFixed(item.round))
					: null,
			nulls: formObjectValue?.nulls || 0,
			canerr: formObjectValue?.canerr || '',
		};
	});

	const newStatusIndicators = statusIndicators.map((item) => {
		const formObjectValue = (formObjectsData as StatusIndicatorValue[]).find(
			(i) => i.objectId === item.id,
		);
		return {
			...item,
			d1Value:
				formObjectValue?.d1Value != null
					? Number(formObjectValue.d1Value.toFixed())
					: null,
			d2Value:
				formObjectValue?.d2Value != null
					? Number(formObjectValue.d2Value.toFixed())
					: null,
			d3Value:
				formObjectValue?.d3Value != null
					? Number(formObjectValue.d3Value.toFixed())
					: null,
			dg1Value:
				formObjectValue?.dg1Value != null
					? Number(formObjectValue.dg1Value.toFixed())
					: null,
			dg2Value:
				formObjectValue?.dg2Value != null
					? Number(formObjectValue.dg2Value.toFixed())
					: null,
			statusCode: formObjectValue?.statusCode || 0,
		};
	});
	return {
		...state,
		formTransparentObjects: newFormTransparentObjects,
		formDynamicObjects: newDynamicObjects,
		isLoading: false,
		statusIndicators: newStatusIndicators,
	};
});
$activeForm.on(setFormObjectEmergencyEventsCount, (state, payload) => {
	const {
		numberOfOwnEmergencyEvents,
		numberOfInternalEmergencyEvents,
		transparentId,
	} = payload;

	const newFormObjects = [...state.formTransparentObjects];
	const objectIndex = newFormObjects.findIndex(
		(item) => item.id === transparentId,
	);
	newFormObjects[objectIndex] = {
		...newFormObjects[objectIndex],
		numberOfOwnEmergencyEvents,
		numberOfInternalEmergencyEvents,
	};
	return {
		...state,
		formTransparentObjects: [...newFormObjects],
	};
});
$activeForm.on(setDynamicObjectImages, (state, payload) => {
	const images = payload;
	const newDynamicObjects = [...state.formDynamicObjects];
	state.formDynamicObjects.forEach((dynamicObject, objectIndex) => {
		const objectImagesInfo = images.filter(
			(item) => item.objectId === dynamicObject.id,
		);
		if (objectImagesInfo)
			newDynamicObjects[objectIndex] = {
				...newDynamicObjects[objectIndex],
				images: [...objectImagesInfo],
			};
	});
	return {
		...state,
		formDynamicObjects: [...newDynamicObjects],
	};
});
$activeForm.watch(setDynamicObjectImages, (state, payload) => {
	const images = payload;
	const fileNames = new Set(images.map((item) => item.fileName));
	Promise.all([
		[...fileNames].map((fileName) => {
			return fetchObjectImageFx({
				formId: state.id as number,
				fileName,
			});
		}),
	]);
});
$activeForm.on(setDynamicObjectImageUrl, (state, payload) => {
	const { url, fileName } = payload;
	const newDynamicObjects = [...state.formDynamicObjects];
	state.formDynamicObjects.forEach((dynamicObject, objectIndex) => {
		const newImages = [...dynamicObject.images];
		dynamicObject.images.forEach((item, index) => {
			if (fileName === item.fileName)
				newImages[index] = { ...newImages[index], url };
		});
		newDynamicObjects[objectIndex] = {
			...newDynamicObjects[objectIndex],
			images: [...newImages],
		};
	});
	return {
		...state,
		formDynamicObjects: [...newDynamicObjects],
	};
});

$activeForm.on(setDynamicObjectValue, (state, payload) => {
	const { objectId, objectValue } = payload;
	const newDynamicObjects = [...state.formDynamicObjects];
	const objectIndex = newDynamicObjects.findIndex(
		(item) => item.id === objectId,
	);
	newDynamicObjects[objectIndex] = {
		...newDynamicObjects[objectIndex],
		selectedImageNumberFromGroup: objectValue,
	};
	return {
		...state,
		formDynamicObjects: [...newDynamicObjects],
	};
});
$activeForm.on(setEmegnecyEventsModeFlag, (state) => {
	return {
		...state,
		isEmergencyEventsModeEnabled: !state.isEmergencyEventsModeEnabled,
	};
});
$activeForm.on(setDynamicObjectsLayerId, (state, dynamicObjectsLayerInfo) => {
	const { formDynamicObjects } = state;
	return {
		...state,
		formDynamicObjects: formDynamicObjects.map((item) => {
			const dynamicObjectWithLayerInfo = dynamicObjectsLayerInfo.find(
				(i) => i.objectId === item.id,
			);
			return {
				...item,
				layerId: dynamicObjectWithLayerInfo?.layerId || 1,
			};
		}),
	};
});
$activeForm.on(setTransparentsLayerId, (state, transparentsLayerInfo) => {
	const { formTransparentObjects, statusIndicators } = state;
	// по этой процедуре приходят коды слоя для индикаторов состояний
	return {
		...state,
		formTransparentObjects: formTransparentObjects.map((item) => {
			const objectWithLayerInfo = transparentsLayerInfo.find(
				(i) => i.objectId === item.id,
			);
			return {
				...item,
				layerId: objectWithLayerInfo?.layerId || 1,
			};
		}),
		statusIndicators: statusIndicators.map((item) => {
			const objectWithLayerInfo = transparentsLayerInfo.find(
				(i) => i.objectId === item.id,
			);
			return {
				...item,
				layerId: objectWithLayerInfo?.layerId || 1,
			};
		}),
	};
});
/* TODO:
	Rewrite logic for setEditMode to have object as parameter with
	2 fields: id and formType (enum FormTypes).
	If formType === FormTypes.FORM - continue, else - skip
*/
$activeForm.watch(setEditMode, (state, isEditing) => {
	const {
		id,
		isTitleVisible,
		title,
		visdelayForm,
		formTransparentObjects,
		formDynamicObjects,
		statusIndicators,
		formBackground,
		backgroundWidth,
		backgroundHeight,
	} = state;
	// Проверяем существует ли id (т.е активная форма типа ФОРМА)
	if (isEditing && id) {
		setDataForEditing({
			id,
			isTitleVisible,
			title,
			visdelayForm,
			formTransparentObjects,
			statusIndicators,
			formDynamicObjects,
			formBackground,
			backgroundWidth,
			backgroundHeight,
		});
	}
});
$activeForm.watch(fetchObjectValues, (state) => {
	const { id, versionCode, formTransparentObjects, dateTime } = state;
	fetchDynamicObjectsLayerIdFx({ formId: id || 0, versionCode });
	fetchTransparentsLayerIdFx({ formId: id || 0, versionCode });
	Promise.allSettled(
		formTransparentObjects.filter((item) => {
			if (item.metricId)
				return fetchTransparentEmergencyEventsCountFx({
					id: item.metricId,
					dateTime: format(dateTime, DateFormat.DisplayDatabaseFormat),
					transparentId: item.id,
				});
		}),
	);
});

$activeForm.watch(saveUserSettings, (state) => {
	const { isUpdateFormEnabled, updateDelay, id, title, formType } = state;
	if (id) {
		setUserSettings({
			formId: id,
			title,
			formType,
			formSettings: {
				isUpdateEnabled: isUpdateFormEnabled,
				updateDelay,
			},
		});
	}
});

$activeForm.on(
	setTransparentSelectedStatus,
	(state, { objectId, isSelected }) => {
		const newFormTransparentObjects = [...state.formTransparentObjects];
		const objectIndex = newFormTransparentObjects.findIndex(
			(item) => item.id === objectId,
		);
		newFormTransparentObjects[objectIndex] = {
			...newFormTransparentObjects[objectIndex],
			isSelected,
		};
		return {
			...state,
			formTransparentObjects: [...newFormTransparentObjects],
		};
	},
);
$activeForm.on(setActiveFormTitle, (state, title) => {
	return {
		...state,
		title,
	};
});
$activeForm.on(setActiveFormType, (state, formType) => {
	return {
		...state,
		formType: Object.values(FormTypes).includes(formType)
			? formType
			: FormTypes.Form,
	};
});
$activeForm.on(setFullScreenMode, (state, isFullScreenModeEnabled) => {
	return {
		...state,
		isFullScreenModeEnabled,
	};
});
$activeForm.on(setFormProportionsMode, (state, isFormProportionsSaved) => {
	return {
		...state,
		isFormProportionsSaved,
	};
});

$activeFormLayers.on(setCheckedFormLayers, (state, checkedFormLayers) => {
	return {
		...state,
		checkedFormLayers,
	};
});

$activeFormLayers.on(changeCheckedFormLayers, (state, { id, isChecked }) => {
	const { formLayers, checkedFormLayers, mainLayer } = state;
	if (isChecked) {
		const filteredFormLayers = filterTreeById(formLayers, id);
		if (mainLayer)
			return {
				...state,
				checkedFormLayers: [
					...checkedFormLayers,
					...filteredFormLayers.map((item) => item.id),
				],
			};
		else
			return {
				...state,
				checkedFormLayers: [
					...checkedFormLayers,
					...filteredFormLayers.map((item) => item.id),
				],
			};
	} else {
		const activeFormLayers = formLayers.filter((item) =>
			checkedFormLayers.includes(item.id),
		);
		const filteredFormLayers = removeNodeAndHisChildren(
			[...activeFormLayers],
			id,
		);

		if (mainLayer)
			return {
				...state,
				checkedFormLayers: [
					...filteredFormLayers.map((item) => item.id),
					mainLayer.id,
				],
			};
		return {
			...state,
			checkedFormLayers: filteredFormLayers.map((item) => item.id),
		};
	}
});
$activeFormLayers.on(setFormLayers, (state, formLayers) => {
	return {
		...state,
		formLayers,
	};
});
$activeFormLayers.on(setMainLayerInfo, (state, mainLayer) => {
	return {
		...state,
		mainLayer,
	};
});

sample({
	clock: fetchTransparentEmergencyEventsCountFx.doneData,
	target: setFormObjectEmergencyEventsCount,
});
sample({
	clock: setDateTime,
	target: fetchObjectValues,
});
sample({
	clock: fetchDynamicObjectsLayerIdFx.doneData,
	target: setDynamicObjectsLayerId,
});
sample({
	clock: fetchTransparentsLayerIdFx.doneData,
	target: setTransparentsLayerId,
});

sample({
	clock: getFormInfoById,
	fn: () => {
		return [];
	},
	target: setFormLayers,
});
sample({
	clock: getFormInfoById,
	source: [$user, $activeIds],
	fn: (state) => {
		const [user, activeIds] = state as [User | null, ActiveVersionIdsModel];
		const { activeVersion } = activeIds;
		return {
			userId: user?.preferredUsername || '',
			systemCode: activeVersion?.systemCode || 0,
			moduleName: ModuleName.ConfigurationBlock_getSystemLayersFx,
		};
	},
	target: getSystemLayersFx,
});
sample({
	clock: getFormInfoById,
	source: [$user],
	fn: (state, clockData) => {
		const [user] = state as [User | null];
		const { formId } = clockData;
		return {
			userId: user?.preferredUsername || '',
			formId,
			moduleName: ModuleName.ConfigurationBlock_getCurrentFormLayersFx,
		};
	},
	target: getCurrentFormLayersFx,
});
sample({
	clock: fetchObjectValues,
	source: [$activeFormLayers, $user],
	fn: (state) => {
		const [activeFormLayers, user] = state as [ActiveFormLayers, User | null];
		const { checkedFormLayers } = activeFormLayers;

		return {
			userId: user?.preferredUsername || '',
			layers: checkedFormLayers,
		};
	},
	target: fetchFormObjectsValueByLayersFx,
});

sample({
	clock: [getSystemLayersFx.done],
	source: $activeFormLayers,
	fn: (_, clockData) => {
		const mainLayer = clockData.result.find((item) => item.name === 'Основной');
		return {
			id: mainLayer?.id || 1,
			name: mainLayer?.name || 'Основной',
		};
	},
	target: setMainLayerInfo,
});
sample({
	clock: [getCurrentFormLayersFx.done],
	source: $activeFormLayers,
	filter: ({ formLayers }) => {
		return formLayers.length === 0;
	},
	fn: (state, clockData) => {
		return [...clockData.result.map((item) => item.id)];
	},
	target: setCheckedFormLayers,
});
sample({
	clock: [getCurrentFormLayersFx.done],
	source: $activeFormLayers,
	fn: (_, clockData) => {
		return clockData.result;
	},
	target: setFormLayers,
});
