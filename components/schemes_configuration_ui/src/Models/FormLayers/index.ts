import { toast } from 'react-toastify';
import { createStore, merge, sample } from 'effector';

import { Action } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { handleError } from '../../Utils/handleToast';
import {
	createDynamicObjectFx,
	createStatusIndicatorFx,
	createTransparentFx,
} from '../EditMode/effects';
import {
	addCreatedDynamicObject,
	addCreatedTransparent,
	addStatusIndicator,
	setSelectedObjects,
} from '../EditMode/events';

import {
	changeFormObjectLayerFx,
	createFormLayerFx,
	createSystemLayerFx,
	deleteFormLayerFx,
	deleteSystemLayerFx,
	editSystemLayerFx,
	getCurrentFormLayersFx,
	getSystemLayersFx,
	replaceFormLayerFx,
} from './effects';
import {
	changeCheckedFormLayers,
	changeCheckedSystemLayers,
	setActiveFormLayer,
	setCheckedFormLayers,
	setCheckedSystemLayers,
	setFormLayers,
	setMainLayerInfo,
	setReplacedFormLayerId,
	setSystemLayerActionType,
	setSystemLayerEditData,
	setSystemLayers,
} from './events';
import { FormLayers } from './types';

export const $formLayers = createStore<FormLayers>({
	avaibleSystemLayers: [],
	formLayers: [],
	checkedFormLayers: [],
	checkedSystemLayers: [],
	systemLayerActionType: Action.Create,
	editData: null,
	replacedFormLayerId: null,
	activeFormLayerId: null,
	mainLayer: {
		id: 1,
		name: 'Основной',
	},
});
$formLayers.on(setSystemLayers, (state, avaibleSystemLayers) => {
	return {
		...state,
		avaibleSystemLayers,
	};
});
$formLayers.on(setActiveFormLayer, (state, activeFormLayerId) => {
	return {
		...state,
		activeFormLayerId,
	};
});

$formLayers.on(setSystemLayerActionType, (state, systemLayerActionType) => {
	return {
		...state,
		systemLayerActionType,
	};
});
$formLayers.on(setFormLayers, (state, formLayers) => {
	return {
		...state,
		formLayers,
	};
});
$formLayers.on(setCheckedSystemLayers, (state, checkedSystemLayers) => {
	return {
		...state,
		checkedSystemLayers,
	};
});
$formLayers.on(setCheckedFormLayers, (state, checkedFormLayers) => {
	return {
		...state,
		checkedFormLayers,
	};
});
$formLayers.on(setSystemLayerEditData, (state, editData) => {
	return {
		...state,
		editData,
	};
});
$formLayers.on(setReplacedFormLayerId, (state, replacedFormLayerId) => {
	return {
		...state,
		replacedFormLayerId,
	};
});

$formLayers.on(changeCheckedSystemLayers, (state, { id, isChecked }) => {
	if (isChecked)
		return {
			...state,
			checkedSystemLayers: [...state.checkedSystemLayers, id],
		};
	else
		return {
			...state,
			checkedSystemLayers: state.checkedSystemLayers.filter(
				(item) => item !== id,
			),
		};
});
$formLayers.on(changeCheckedFormLayers, (state, { id, isChecked }) => {
	if (isChecked)
		return {
			...state,
			checkedFormLayers: [...state.checkedFormLayers, id],
		};
	else
		return {
			...state,
			checkedFormLayers: state.checkedFormLayers.filter((item) => item !== id),
		};
});
$formLayers.on(setMainLayerInfo, (state, mainLayer) => {
	return {
		...state,
		mainLayer,
	};
});
sample({
	clock: [getCurrentFormLayersFx.done],
	source: $formLayers,
	fn: (state, clockData) => {
		const { checkedFormLayers } = state;
		return [
			...clockData.result
				.filter((item) => !checkedFormLayers.includes(item.id))
				.map((item) => item.id),
			...checkedFormLayers,
		];
	},
	target: setCheckedFormLayers,
});
sample({
	clock: [getSystemLayersFx.done],
	fn: (clockData) => {
		return clockData.result;
	},
	target: setSystemLayers,
});

sample({
	clock: [getCurrentFormLayersFx.done],
	fn: (clockData) => {
		return clockData.result;
	},
	target: setFormLayers,
});

sample({
	clock: [getCurrentFormLayersFx.done],
	fn: (clockData) => {
		return clockData.result.map((item) => item.layerId);
	},
	target: setCheckedSystemLayers,
});

$formLayers.watch(deleteFormLayerFx.done, () => {
	toast.success('Слой формы удален');
	setSelectedObjects([]);
});

const handleRequestFails = merge([
	editSystemLayerFx.fail,
	deleteSystemLayerFx.fail,
	createFormLayerFx.fail,
	getCurrentFormLayersFx.fail,
	createSystemLayerFx.fail,
	getSystemLayersFx.fail,
	changeFormObjectLayerFx.fail,
	deleteFormLayerFx.fail,
	replaceFormLayerFx.fail,
]);
$formLayers.watch(handleRequestFails, (_state, { error }) => {
	handleError(error);
});

$formLayers.watch(createDynamicObjectFx.done, (layersState, { result }) => {
	const { objectDynamicParameters, createdDynamicObjectId, dynamicObject } =
		result;
	const { formLayers } = layersState;
	const mainLayerId = formLayers.find((item) => item.name === 'Основной')?.id;
	if ((dynamicObject as DynamicObjectConfiguration).layerId == null)
		(dynamicObject as DynamicObjectConfiguration).layerId = mainLayerId || 1;
	if (createdDynamicObjectId) {
		addCreatedDynamicObject({
			objectDynamicParameters,
			createdDynamicObjectId,
			dynamicObject,
		});
	}
});
$formLayers.watch(createTransparentFx.done, (layersState, { result }) => {
	const { objectParameters, createdTransparentId, transparentObject } = result;
	const { formLayers } = layersState;
	const mainLayerId = formLayers.find((item) => item.name === 'Основной')?.id;
	if ((transparentObject as TransparentConfiguration).layerId == null)
		(transparentObject as TransparentConfiguration).layerId = mainLayerId || 1;
	if (createdTransparentId) {
		addCreatedTransparent({
			objectParameters,
			createdTransparentId,
			transparentObject,
		});
	}
});
$formLayers.watch(createStatusIndicatorFx.done, (layersState, { result }) => {
	const {
		statusIndicatorParameters,
		createdStatusIndicatorId,
		statusIndicator,
	} = result;
	const { formLayers } = layersState;
	const mainLayerId = formLayers.find((item) => item.name === 'Основной')?.id;
	if ((statusIndicator as StatusIndicatorConfiguration).layerId == null)
		(statusIndicator as StatusIndicatorConfiguration).layerId =
			mainLayerId || 1;
	if (createdStatusIndicatorId) {
		addStatusIndicator({
			statusIndicatorParameters,
			createdStatusIndicatorId,
			statusIndicator,
		});
	}
});
