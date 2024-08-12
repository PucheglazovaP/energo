import { createStore, sample } from 'effector';
import { XrangePointOptionsObject } from 'highcharts';

import { convertImage, uploadImageAdapter } from '../../Adapters/imageAdapter';
import {
	createConfigurationTree,
	sortConfigurationItems,
} from '../../Containers/ConfigurationBlock/utils';
import { createRandomPoints } from '../../Containers/EditChart/utils';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	ConfigurationTypes,
	FormTypes,
	Trend,
	UpdateFormObjectParameterParams,
	User,
} from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	FormObjectConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import { convertHexColor } from '../../Utils/convertColor';
import { isPropertyColor } from '../../Utils/guards';
import { RpcError } from '../../Utils/requests';
import { fetchFormParametersFx as fetchChartParametersFx } from '../ActiveChart/effects';
import { fetchFormObjectsFx as fetchChartObjectsFx } from '../ActiveChart/effects';
import {
	setActiveChartTitle,
	setActiveChartType,
	setChartData,
} from '../ActiveChart/events';
import { $activeForm } from '../ActiveForm';
import { fetchFormObjectsFx } from '../ActiveForm/effects';
import {
	setActiveFormParameters,
	setActiveFormTitle,
} from '../ActiveForm/events';
import { Form } from '../ActiveForm/types';
import { $user } from '../Auth';
import { $formContextMenu } from '../FormContextMenu';
import { uploadObjectImageFx } from '../FormContextMenu/effects';
import {
	addImage,
	copyDynamicObject,
	copyStatusIndicator,
	copyTransparent,
	setContextMenuObject,
	setContextMenuObjectById,
	switchToSubForm,
} from '../FormContextMenu/events';
import { FormContextMenuModel } from '../FormContextMenu/types';
import { $formLayers } from '../FormLayers';
import {
	changeFormObjectLayerFx,
	createFormLayerFx,
	deleteFormLayerFx,
	getCurrentFormLayersFx,
	replaceFormLayerFx,
} from '../FormLayers/effects';
import { setActiveFormLayer } from '../FormLayers/events';
import { FormLayers } from '../FormLayers/types';
import { disableEditMode, setFormSettings } from '../FormSettings/events';
import { openModal } from '../Modal/events';
import { $multichartSettings } from '../MultichartSettings';
import { setMultichartActiveId } from '../MultichartSettings/events';
import { MultichartSettingsModel } from '../MultichartSettings/types';
import { setDisabledFlag, setOpenFlag } from '../Sidebar/events';
import { $treeForms } from '../TreeForms';
import { fetchFormTreeDataFx } from '../TreeForms/effects';
import { getFormInfoById } from '../TreeForms/events';
import { FormTreeItem } from '../TreeForms/types';

import {
	changeFormNameFx,
	copyDynamicObjectFx,
	copyStatusIndicatorFx,
	copyTransparentFx,
	createDynamicObjectFx,
	createStatusIndicatorFx,
	createTransparentFx,
	fetchFormInfoForEditingFx,
	fetchFormObjectsParametersQuerysFx,
	updateFormObjectParameterFx,
	updateFormParameterFx,
	uploadImageFx,
} from './effects';
import {
	addChartPoints,
	addCreatedDynamicObject,
	addCreatedTransparent,
	addStatusIndicator,
	changeFormName,
	changeFormType,
	createDynamicObject,
	createStatusIndicator,
	createTransparent,
	deleteChartPoints,
	deleteDynamicObject,
	deleteObjectParameters,
	deleteStatusIndicator,
	deleteTransparent,
	reset,
	resetEditFormData,
	resetSelection,
	setConfigTreeItemOpenState,
	setConfigTreeOpenState,
	setConfigurationType,
	setCreateDynamicObjectMode,
	setCreateStatusIndicatorMode,
	setCreateTransparentMode,
	setDataForEditing,
	setDynamicObjectImages,
	setDynamicObjectsImages,
	setEditableParameterName,
	setEditMode,
	setFormName,
	setFormSelectedStatus,
	setHighlightingBanners,
	setHintMode,
	setObjectParameters,
	setObjectSelectedStatus,
	setSelectedObjectConfig,
	setSelectedObjects,
	setSelectingDynamicObjects,
	setShowSelectedDynamicObject,
	setShowSelectedTransparentObject,
	updateFormParameter,
	updateObjectParameter,
	updateObjectsWithParameters,
} from './events';
import {
	EditMode,
	FormObjectParameters,
	FormObjectValue,
	FormParameters,
	ObjectConfigTreeOpenState,
	SelectedObjectsState,
} from './types';

const EDIT_MODE_DEFAULT_STATE: EditMode = {
	isEditing: false,
	formParameters: [],
	objectParameters: new Map(),
	id: null,
	isTitleVisible: false,
	title: '',
	visdelayForm: 0,
	formTransparentObjects: [],
	formDynamicObjects: [],
	statusIndicators: [],
	formType: FormTypes.Form,
	formBackground: '',
	backgroundWidth: 0,
	backgroundHeight: 0,
	isLoading: true,
	trendMode: '-1',
	editedParameterCode: null,
	isCreateTransparentModeEnabled: false,
	isCreateStatusIndicatorEnabled: false,
	isCreateDynamicObjectModeEnabled: false,
	editedParameterName: '',
	editedFile: '',
	editedFileName: '',
	existingFile: '',
	isUpdateFormEnabled: false,
	updateDelay: 60,
	versionCode: 90,
	chartPoints: new Map(),
	dateTime: new Date(),
	isEmergencyEventsModeEnabled: false,
	selectedConfigurationType: ConfigurationTypes.Inspector,
	isFullScreenModeEnabled: false,
	isFormProportionsSaved: true,
	isHintModeEnabled: true,
	editableParameterName: '',
	selectedObjectConfig: [],
};

export const $editMode = createStore<EditMode>(EDIT_MODE_DEFAULT_STATE);

export const $selectedObjectsState = createStore<SelectedObjectsState>({
	isFormSelected: false,
	selectedObjects: [],
});

$editMode.on(setEditMode, (state, isEditing) => ({
	...state,
	isEditing,
}));
$editMode.on(setCreateTransparentMode, (state) => ({
	...state,
	isCreateTransparentModeEnabled: !state.isCreateTransparentModeEnabled,
}));
$editMode.on(setCreateStatusIndicatorMode, (state) => ({
	...state,
	isCreateStatusIndicatorEnabled: !state.isCreateStatusIndicatorEnabled,
}));
$editMode.on(setCreateDynamicObjectMode, (state) => ({
	...state,
	isCreateDynamicObjectModeEnabled: !state.isCreateDynamicObjectModeEnabled,
}));
$editMode.on(setCreateDynamicObjectMode, (state) => ({
	...state,
	isCreateDynamicObjectModeEnabled: !state.isCreateDynamicObjectModeEnabled,
}));

$editMode.watch(setHighlightingBanners, (state) => {
	setFormSelectedStatus(false);
	setSelectedObjects([...state.formTransparentObjects]);
});

$editMode.watch(setSelectingDynamicObjects, (state) => {
	setFormSelectedStatus(false);
	setSelectedObjects([...state.formDynamicObjects]);
});

$editMode.watch(setShowSelectedDynamicObject, (state, objects) => {
	setFormSelectedStatus(false);
	setSelectedObjects([...objects]);
});

$editMode.watch(setShowSelectedTransparentObject, (state, objects) => {
	setFormSelectedStatus(false);
	setSelectedObjects([...objects]);
});

$editMode.reset(reset);
$editMode.on(setDataForEditing, (state, formParameters) => ({
	...state,
	...formParameters,
}));
$editMode.watch(setEditMode, (state, isEditing) => {
	if (isEditing) {
		setOpenFlag(false);
		setDisabledFlag(true);
	} else {
		setOpenFlag(true);
		setDisabledFlag(false);
	}
});
$editMode.on(setEditableParameterName, (state, editableParameterName) => ({
	...state,
	editableParameterName,
}));

$editMode.watch(fetchFormInfoForEditingFx, (state, params) => {
	const { versionCode } = params;
	const { formTransparentObjects, formDynamicObjects, statusIndicators } =
		state;
	const objects = [
		...formTransparentObjects,
		...formDynamicObjects,
		...statusIndicators,
	];
	setDataForEditing({ versionCode });
	if (objects.length > 0)
		Promise.all([
			objects.map((item) => {
				return fetchFormObjectsParametersQuerysFx({
					objectId: item.id,
					versionCode,
				});
			}),
		]);
	else setDataForEditing({ isLoading: false });
});

$editMode.on(setObjectParameters, (state, payload) => {
	const { objectParameters } = state;
	const { objectId, parameters } = payload;
	const newObjectParameters: Map<number, FormObjectParameters[]> = new Map(
		objectParameters,
	);

	newObjectParameters.set(objectId, parameters);
	return {
		...state,
		objectParameters: newObjectParameters,
	};
});

$editMode.on(deleteObjectParameters, (state, id) => {
	const { objectParameters } = state;
	const newObjectParameters: Map<number, FormObjectParameters[]> = new Map(
		objectParameters,
	);
	newObjectParameters.delete(id);
	return {
		...state,
		objectParameters: newObjectParameters,
	};
});

updateFormParameter.watch((payload) => {
	const {
		value,
		parameterCode,
		formId,
		versionCode,
		pairedParameterName,
		pairedParameterValue,
	} = payload;
	updateFormParameterFx({
		value,
		parameterCode,
		formId,
		versionCode,
		itHasPairedParameter: !!pairedParameterName,
		pairedParameterValue: pairedParameterName
			? pairedParameterValue
			: undefined,
	});
});
$editMode.on(updateFormParameter, (state, payload) => {
	const {
		value,
		parameterCode,
		parameterName,
		pairedParameterName,
		pairedParameterValue,
	} = payload;
	const { formParameters } = state;
	const config: FormParameters[] = formParameters.map((item) => {
		if (item.parameterName === pairedParameterName)
			return { ...item, value: String(pairedParameterValue) };
		if (item.parameterCode === parameterCode) return { ...item, value: value };
		return { ...item };
	});
	return {
		...state,
		formParameters: config,
		[parameterName]: value,
	};
});

$editMode.on(addCreatedTransparent, (state, payload) => {
	const {
		objectParameters: createdObjectParams,
		createdTransparentId,
		transparentObject,
	} = payload;
	const { formTransparentObjects, objectParameters } = state;
	const newFormTransparentObjects = [...formTransparentObjects];
	newFormTransparentObjects.push(transparentObject as TransparentConfiguration);
	const newObjectParameters = new Map(objectParameters);
	newObjectParameters.set(createdTransparentId, createdObjectParams);
	return {
		...state,
		objectParameters: newObjectParameters,
		formTransparentObjects: newFormTransparentObjects,
	};
});

// addCreatedDynamicObject
$editMode.on(addCreatedDynamicObject, (state, payload) => {
	const {
		objectDynamicParameters: createdObjectParams,
		createdDynamicObjectId,
		dynamicObject,
	} = payload;
	const { formDynamicObjects, objectParameters } = state;
	const newFormDynamicObjects = [...formDynamicObjects];
	newFormDynamicObjects.push(dynamicObject as any);
	const newObjectParameters = new Map(objectParameters);
	newObjectParameters.set(createdDynamicObjectId, createdObjectParams);
	return {
		...state,
		objectParameters: newObjectParameters,
		formDynamicObjects: newFormDynamicObjects,
	};
});
$editMode.on(addCreatedDynamicObject, (state, payload) => {
	const {
		objectDynamicParameters: createdObjectParams,
		createdDynamicObjectId,
		dynamicObject,
	} = payload;
	const { formDynamicObjects, objectParameters } = state;
	const newFormDynamicObjects = [...formDynamicObjects];
	newFormDynamicObjects.push(dynamicObject as any);
	const newObjectParameters = new Map(objectParameters);
	newObjectParameters.set(createdDynamicObjectId, createdObjectParams);
	return {
		...state,
		objectParameters: newObjectParameters,
		formDynamicObjects: newFormDynamicObjects,
	};
});
$editMode.on(addStatusIndicator, (state, payload) => {
	const {
		statusIndicatorParameters: createdObjectParams,
		createdStatusIndicatorId,
		statusIndicator,
	} = payload;
	const { statusIndicators, objectParameters } = state;
	const newStatusIndicators = [...statusIndicators];
	newStatusIndicators.push(statusIndicator as any);
	const newObjectParameters = new Map(objectParameters);
	newObjectParameters.set(createdStatusIndicatorId || 0, createdObjectParams);
	return {
		...state,
		objectParameters: newObjectParameters,
		statusIndicators: newStatusIndicators,
	};
});
sample({
	clock: deleteTransparent,
	source: [$editMode, $selectedObjectsState],
	fn: (state, payload) => {
		const [editMode, selectedObjectsState] = state as [
			EditMode,
			SelectedObjectsState,
		];
		const { formTransparentObjects, objectParameters } = editMode;
		const { selectedObjects } = selectedObjectsState;
		const newFormTransparentObjects = formTransparentObjects.filter(
			(item) => item.id !== payload,
		);
		const newObjectParameters = new Map(objectParameters);
		newObjectParameters.delete(payload);
		return {
			objectParameters: newObjectParameters,
			formTransparentObjects: newFormTransparentObjects,
			selectedObjects: selectedObjects.filter((obj) => obj.id !== payload),
		};
	},
	target: setDataForEditing,
});
$editMode.on(uploadImageFx.done, (state, payload) => {
	const {
		params: { fileName, image },
	} = payload;
	const extension = fileName.match(/\.([^.]+)$/)?.[1];

	return {
		...state,
		formBackground: `data:image/${extension}${
			extension === 'svg' && '+xml;utf8'
		};base64,${image}`,
		existingFile: '',
	};
});
$editMode.watch(uploadImageFx.done, (state, payload) => {
	const {
		params: { fileName, formId, versionCode },
	} = payload;
	const { editedParameterCode, editedParameterName } = state;
	if (editedParameterCode && editedParameterName)
		updateFormParameter({
			value: fileName,
			parameterCode: editedParameterCode,
			formId,
			parameterName: editedParameterName,
			versionCode,
		});
	setDataForEditing({
		editedParameterCode: null,
		editedParameterName: '',
		editedFile: '',
		editedFileName: '',
	});
});

$editMode.on(uploadImageFx.fail, (state, payload) => {
	const {
		params: { fileName, image },
	} = payload;
	const extension = fileName.match(/\.([^.]+)$/)?.[1] || 'png';

	return {
		...state,
		editedFile: `data:image/${extension}${
			extension === 'svg' && '+xml;utf8'
		};base64,${image}`,
		editedFileName: fileName,
	};
});
$editMode.watch(uploadImageFx.fail, async (_state, payload) => {
	const {
		params: { fileName },
		error,
	} = payload;
	const extension = fileName.match(/\.([^.]+)$/)?.[1] || 'png';
	let existingBinaryFile = '';
	if (error instanceof RpcError) {
		if (error.details.errorDescription) {
			existingBinaryFile = uploadImageAdapter(error.details.errorDescription);
		}
	}
	const existingFile = await convertImage(extension, existingBinaryFile);

	setDataForEditing({ existingFile });
});
$editMode.watch(uploadObjectImageFx.fail, async (_state, payload) => {
	const {
		params: { name },
		error,
	} = payload;
	const extension = name.match(/\.([^.]+)$/)?.[1] || 'png';
	let existingBinaryFile = '';
	if (error instanceof RpcError) {
		if (error.details.errorDescription) {
			existingBinaryFile = uploadImageAdapter(error.details.errorDescription);
		}
	}
	const existingFile = await convertImage(extension, existingBinaryFile);

	setDataForEditing({ existingFile });
	openModal(RegisteredModals.NewImageWarning);
});
$editMode.on(uploadObjectImageFx.fail, (state, payload) => {
	const {
		params: { name, binary },
	} = payload;
	const extension = name.match(/\.([^.]+)$/)?.[1] || 'png';

	return {
		...state,
		editedFile: `data:image/${extension}${
			extension === 'svg' && '+xml;utf8'
		};base64,${binary}`,
		editedFileName: name,
	};
});
sample({
	clock: deleteDynamicObject,
	source: [$editMode, $selectedObjectsState],
	fn: (state, payload) => {
		const [editMode, selectedObjectsState] = state as [
			EditMode,
			SelectedObjectsState,
		];
		const { formDynamicObjects, objectParameters } = editMode;
		const { selectedObjects } = selectedObjectsState;
		const newformDynamicObjects = formDynamicObjects.filter(
			(item) => item.id !== payload,
		);
		const newObjectParameters = new Map(objectParameters);
		newObjectParameters.delete(payload);
		return {
			objectParameters: newObjectParameters,
			formDynamicObjects: newformDynamicObjects,
			selectedObjects: selectedObjects.filter((obj) => obj.id !== payload),
		};
	},
	target: setDataForEditing,
});
sample({
	clock: deleteStatusIndicator,
	source: [$editMode, $selectedObjectsState],
	fn: (state, payload) => {
		const [editMode, selectedObjectsState] = state as [
			EditMode,
			SelectedObjectsState,
		];
		const { selectedObjects } = selectedObjectsState;
		const { statusIndicators, objectParameters } = editMode;
		const newStatusIndicators = statusIndicators.filter(
			(item) => item.id !== payload,
		);
		const newObjectParameters = new Map(objectParameters);
		newObjectParameters.delete(payload);
		return {
			objectParameters: newObjectParameters,
			statusIndicators: newStatusIndicators,
			selectedObjects: selectedObjects.filter((obj) => obj.id !== payload),
		};
	},
	target: setDataForEditing,
});
$editMode.on(setDynamicObjectImages, (state, payload) => {
	const { id, images } = payload;

	const newDynamicObjects = state.formDynamicObjects.map((obj) => {
		if (obj.id === id) {
			return {
				...obj,
				images,
			};
		}
		return obj;
	});
	return {
		...state,
		formDynamicObjects: newDynamicObjects,
	};
});
$editMode.on(setDynamicObjectsImages, (state, payload) => {
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
$editMode.on(changeFormType, (state, formType) => ({
	...state,
	formType,
}));

$editMode.on(updateObjectsWithParameters, (state, payload) => {
	return {
		...state,
		...payload,
	};
});

$editMode.on(addChartPoints, (state, payload) => {
	const [id, points] = payload;
	const newPoints = new Map(state.chartPoints);
	newPoints.set(id, points);
	return {
		...state,
		chartPoints: newPoints,
	};
});

$editMode.on(deleteChartPoints, (state, id) => {
	const newPoints = new Map(state.chartPoints);
	newPoints.delete(id);
	return {
		...state,
		chartPoints: newPoints,
	};
});

$editMode.on(setFormName, (state, payload) => {
	return {
		...state,
		title: payload,
	};
});

/* DECLARATIVES */

// update multichart points when data on object (trend) is loaded
sample({
	clock: fetchFormObjectsParametersQuerysFx.done,
	source: $editMode,
	filter: (model) => model.formType === FormTypes.MultiChart,
	fn: (_sourceData, clockData) => {
		const {
			params: { objectId },
		} = clockData;
		const points: [number, XrangePointOptionsObject[]] = [
			objectId,
			createRandomPoints({}),
		];
		return points;
	},
	target: addChartPoints,
});
sample({
	clock: fetchFormObjectsParametersQuerysFx.done,
	source: $editMode,
	filter: (model) => model.formType === FormTypes.MultiChart,
	fn: (_sourceData, clockData) => {
		const {
			params: { objectId },
		} = clockData;
		const points: [number, XrangePointOptionsObject[]] = [
			objectId,
			createRandomPoints({}),
		];
		return points;
	},
	target: addChartPoints,
});
// set new points for the chart if it's not multichart
sample({
	clock: setChartData,
	source: $editMode,
	filter: (editMode) => editMode.formType === FormTypes.Chart,
	fn: (_sourceData, clockData) => {
		const series: Trend = clockData[0];
		const newPoints: [number, XrangePointOptionsObject[]] = [
			series.id || 0,
			createRandomPoints({}),
		];
		return newPoints;
	},
	target: addChartPoints,
});

// update object parameter when form type is multichart
sample({
	clock: updateObjectParameter,
	source: [$editMode, $multichartSettings],
	filter: ([editMode]) =>
		(editMode as EditMode).formType === FormTypes.MultiChart,
	fn: ([editMode, multichartSettings], clockData) => {
		const { value, parameterName, pairedParameterName, pairedParameterValue } =
			clockData;
		const { objectParameters } = editMode as EditMode;
		const { activeId: activeTrendId } =
			multichartSettings as MultichartSettingsModel;

		const config: FormObjectParameters[] | undefined =
			objectParameters.get(activeTrendId);

		const newParameters: FormObjectParameters[] | undefined = config?.map(
			(item) => {
				if (item.parameterName === parameterName)
					return { ...item, value: value || '' };
				if (item.parameterName === pairedParameterName)
					return { ...item, value: pairedParameterValue || '' };
				return { ...item };
			},
		);

		return {
			objectId: activeTrendId,
			parameters: newParameters || [],
		};
	},
	target: setObjectParameters,
});
sample({
	clock: updateObjectParameter,
	source: [$editMode, $multichartSettings],
	filter: ([editMode]) =>
		(editMode as EditMode).formType === FormTypes.MultiChart,
	fn: ([, multichartSettings], clockData) => {
		const {
			value,
			versionCode,
			parameterName,
			pairedParameterName,
			pairedParameterValue,
			parameterCode,
		} = clockData;
		const { activeId: activeTrendId } =
			multichartSettings as MultichartSettingsModel;

		const convertedValue = isPropertyColor(parameterName)
			? convertHexColor(String(value))
			: value;

		if (!pairedParameterName)
			return {
				value: convertedValue,
				parameterCode: parameterCode || 0,
				objectId: activeTrendId,
				versionCode,
			};
		else
			return {
				value: convertedValue,
				parameterCode: parameterCode || 0,
				objectId: activeTrendId,
				versionCode,
				itHasPairedParameter: true,
				pairedParameterValue: pairedParameterValue,
			};
	},
	target: updateFormObjectParameterFx,
});
// update object parameter when form is not multichart
sample({
	clock: updateObjectParameter,
	source: $editMode,
	filter: (editMode) => editMode.formType !== FormTypes.MultiChart,
	fn: (sourceData, clockData) => {
		const {
			objectId,
			value,
			parameterName,
			pairedParameterName,
			pairedParameterValue,
		} = clockData;
		const {
			objectParameters,
			statusIndicators,
			formTransparentObjects,
			formDynamicObjects,
		} = sourceData;
		const newObjectParameters = new Map(objectParameters);
		const updatedStatusIndicators = statusIndicators.map((item) => {
			if (item.id === objectId) {
				return {
					...item,
					[parameterName]: value,
					...(pairedParameterName && {
						[pairedParameterName]: pairedParameterValue,
					}),
				};
			}
			return item;
		});
		// Update transparent objects with new values
		const transparentObjects: TransparentConfiguration[] =
			formTransparentObjects.map((transparent) => {
				if (transparent.id === objectId) {
					return {
						...transparent,
						[parameterName]: value,
						...(pairedParameterName && {
							[pairedParameterName]: pairedParameterValue,
						}),
					};
				}
				return transparent;
			});

		// Update dynamic objects with new values
		const dynamicObjects: DynamicObjectConfiguration[] = formDynamicObjects.map(
			(dynamicObject) => {
				if (dynamicObject.id === objectId) {
					return {
						...dynamicObject,
						[parameterName]: value,
						...(pairedParameterName && {
							[pairedParameterName]: pairedParameterValue,
						}),
					};
				}
				return dynamicObject;
			},
		);

		// Update configurator properties with new value
		// object parameters
		const config = newObjectParameters.get(objectId);

		if (config) {
			// rewrite parameterName and pairedParameterName values
			const newConfigValues = config.map((item) => {
				if (item.parameterName === parameterName)
					return { ...item, value: value || '' };

				if (item.parameterName === pairedParameterName)
					return { ...item, value: pairedParameterValue || '' };

				return item;
			});

			newObjectParameters.set(objectId, newConfigValues);
		}

		return {
			formTransparentObjects: transparentObjects,
			formDynamicObjects: dynamicObjects,
			objectParameters: newObjectParameters,
			statusIndicators: updatedStatusIndicators,
		};
	},
	target: updateObjectsWithParameters,
});

$editMode.on(setConfigurationType, (state, selectedConfigurationType) => {
	return {
		...state,
		selectedConfigurationType,
	};
});
$editMode.on(setHintMode, (state, isHintModeEnabled) => {
	return {
		...state,
		isHintModeEnabled,
	};
});
// update object parameter when form is not multichart
// CALL PROCEDURE
sample({
	clock: updateObjectParameter,
	source: $editMode,
	filter: (src) => src.formType !== FormTypes.MultiChart,
	fn: (_src, clk) => {
		const {
			objectId,
			parameterName,
			value,
			versionCode,
			pairedParameterName,
			pairedParameterValue,
			parameterCode,
		} = clk;

		const convertedValue = isPropertyColor(parameterName)
			? convertHexColor(String(value))
			: value;

		const params: UpdateFormObjectParameterParams = Object.assign(
			{
				value: convertedValue,
				parameterCode: Number(parameterCode),
				objectId,
				versionCode,
			},
			pairedParameterName
				? {
						itHasPairedParameter: true,
						pairedParameterValue: pairedParameterValue,
				  }
				: {},
		);

		return params;
	},
	target: updateFormObjectParameterFx,
});

// Delete object form parameters of deleted trend
sample({
	clock: deleteChartPoints,
	target: deleteObjectParameters,
});

// Set form id as active id for multichart when trend is deleted
// and change form selected status to true
sample({
	clock: deleteChartPoints,
	source: $editMode,
	fn: (sourceData) => {
		setFormSelectedStatus(true);
		return sourceData.id || 0;
	},
	target: setMultichartActiveId,
});

// Update chart name when it's changed on the active chart
sample({
	clock: setActiveChartTitle,
	fn: (clockData) => ({ title: clockData }),
	target: setDataForEditing,
});

// Update form type of the edit mode when it's changed on the active chart
sample({
	clock: setActiveChartType,
	fn: (clockData) => ({ formType: clockData }),
	target: setDataForEditing,
});

// добавление скопированного транспаранта
sample({
	source: $editMode,
	clock: copyTransparent,
	filter: (sourceData) => sourceData.id != null,
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		return {
			formId: id || 0,
			versionId: versionCode,
			id: clockData.objectId,
			moduleName: ModuleName.CopyTransparent_sample_copyTransparentFx,
			...clockData,
		};
	},
	target: copyTransparentFx,
});

// добавление скопированного ДО
sample({
	source: $editMode,
	clock: copyDynamicObject,
	filter: (sourceData) => sourceData.id != null,
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		return {
			formId: id || 0,
			versionId: versionCode,
			id: clockData.objectId,
			moduleName: ModuleName.CopyDynamicObject_sample_copyDynamicObjectFx,
			...clockData,
		};
	},
	target: copyDynamicObjectFx,
});
sample({
	source: $editMode,
	clock: copyStatusIndicator,
	filter: (sourceData) => sourceData.id != null,
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		return {
			formId: id || 0,
			versionId: versionCode,
			id: clockData.objectId,
			moduleName: ModuleName.CopyStatusIndicator_sample_copyStatusIndicatorFx,
			...clockData,
		};
	},
	target: copyStatusIndicatorFx,
});
sample({
	clock: disableEditMode,
	source: [$editMode, $user],
	fn: (sourceData) => {
		const [editMode, user] = sourceData as [EditMode, User];
		const { versionCode } = editMode;
		return {
			moduleName: ModuleName.UseCreateFromTransparent_fetchFormTreeDataFx,
			versionCode: versionCode,
			userId: user.preferredUsername || '',
		};
	},
	target: fetchFormTreeDataFx,
});
sample({
	clock: disableEditMode,
	source: [$editMode, $user],
	fn: (sourceData) => {
		const [editMode, user] = sourceData as [EditMode, User];
		const { id, versionCode } = editMode;
		return {
			formId: Number(id),
			versionCode: versionCode,
			userId: user.preferredUsername || '',
		};
	},
	target: getFormInfoById,
});

// Reset form value after close, but save hint mode value
sample({
	clock: disableEditMode,
	source: $editMode,
	target: resetEditFormData,
});

$editMode.on(resetEditFormData, (state) => {
	return {
		...EDIT_MODE_DEFAULT_STATE,
		isHintModeEnabled: state.isHintModeEnabled,
	};
});

// Change form name
sample({
	clock: changeFormName,
	source: $editMode,
	filter: (sourceData) => {
		const { id } = sourceData;
		return id != null;
	},
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		const { name, userId } = clockData;
		const changeFormNameParams = {
			formId: id || 0,
			versionCode,
			newFormName: name,
			userId,
			moduleName: ModuleName.ChangeFormName_sample_changeFormNameFx,
		};
		return changeFormNameParams;
	},
	target: changeFormNameFx,
});
sample({
	clock: changeFormNameFx.done,
	fn: (clockData) => {
		const {
			params: { newFormName },
		} = clockData;
		return newFormName;
	},
	target: setFormName,
});
$editMode.watch(updateFormObjectParameterFx.done, (state) => {
	const {
		formTransparentObjects,
		formDynamicObjects,
		statusIndicators,
		versionCode,
	} = state;
	const objects = [
		...formTransparentObjects,
		...formDynamicObjects,
		...statusIndicators,
	];
	Promise.all([
		objects.map((item) => {
			return fetchFormObjectsParametersQuerysFx({
				objectId: item.id,
				versionCode,
			});
		}),
	]);
});
sample({
	clock: changeFormNameFx.done,
	fn: (clockData) => {
		const {
			params: { newFormName },
		} = clockData;
		return newFormName;
	},
	target: setActiveFormTitle,
});
// запрос данных подчиненной формы
sample({
	clock: switchToSubForm,
	source: [$editMode, $treeForms, $user],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode];
		const { isEditing } = editModeState;
		return isEditing;
	},
	fn: (sourceData, objectId) => {
		const [editModeState, treeState, user] = sourceData as [
			EditMode,
			FormTreeItem[],
			User,
		];
		const { formTransparentObjects, formDynamicObjects, versionCode } =
			editModeState;
		const formObject = [...formTransparentObjects, ...formDynamicObjects].find(
			(item) => item.id === objectId,
		);
		if (formObject && formObject.gotonCode) {
			const treeItem = treeState.find(
				(item) => item.id === formObject.gotonCode,
			);
			if (treeItem)
				return {
					formId: treeItem.id,
					versionCode,
					userId: user.preferredUsername || '',
				};
		}
		return {
			formId: 0,
			versionCode,
			userId: user.preferredUsername || '',
		};
	},
	target: getFormInfoById,
});
sample({
	clock: switchToSubForm,
	source: [$editMode, $treeForms],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode];
		const { isEditing } = editModeState;
		return isEditing;
	},
	fn: (sourceData, objectId) => {
		const [editModeState, treeState] = sourceData as [EditMode, FormTreeItem[]];
		const { formTransparentObjects, formDynamicObjects, versionCode } =
			editModeState;
		const formObject = [...formTransparentObjects, ...formDynamicObjects].find(
			(item) => item.id === objectId,
		);
		if (formObject && formObject.gotonCode) {
			const treeItem = treeState.find(
				(item) => item.id === formObject.gotonCode,
			);
			if (treeItem)
				return {
					id: treeItem.id,
					isLoading: true,
					formType: treeItem.formType,
					versionCode,
				};
		}
		return {
			id: 0,
			isLoading: true,
			formType: FormTypes.Form,
			versionCode,
		};
	},
	target: setDataForEditing,
});
sample({
	clock: switchToSubForm,
	source: [$editMode, $treeForms],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode];
		const { isEditing } = editModeState;
		return isEditing;
	},
	fn: (sourceData, objectId) => {
		const [editModeState, treeState] = sourceData as [EditMode, FormTreeItem[]];
		const { formTransparentObjects, formDynamicObjects } = editModeState;
		const formObject = [...formTransparentObjects, ...formDynamicObjects].find(
			(item) => item.id === objectId,
		);
		if (formObject && formObject.gotonCode) {
			const treeItem = treeState.find(
				(item) => item.id === formObject.gotonCode,
			);
			if (treeItem)
				return {
					activeId: treeItem.id,
					formType: treeItem.formType,
				};
		}
		return {
			activeId: 0,
			formType: FormTypes.Form,
		};
	},
	target: setFormSettings,
});

sample({
	clock: $activeForm,
	source: [$editMode, $activeForm],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode, Form];
		const { isEditing } = editModeState;
		return isEditing;
	},
	fn: (sourceData) => {
		const [, formState] = sourceData as [EditMode, Form];
		const {
			isTitleVisible,
			title,
			visdelayForm,
			formBackground,
			formDynamicObjects,
			backgroundWidth,
			backgroundHeight,
			formType,
			formTransparentObjects,
			statusIndicators,
		} = formState;

		return {
			isTitleVisible,
			title,
			visdelayForm,
			formTransparentObjects,
			formDynamicObjects,
			statusIndicators,
			formBackground,
			backgroundWidth,
			backgroundHeight,
			selectedObjects: [],
			isFormSelected: true,
			formType,
		};
	},
	target: setDataForEditing,
});
sample({
	clock: fetchFormObjectsFx.done,
	source: $editMode,
	filter: (sourceData) => {
		const { isEditing, id } = sourceData;
		return isEditing && id != null;
	},
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		const {
			params: { userId },
		} = clockData;
		return {
			formId: id || 0,
			versionCode,
			userId,
		};
	},
	target: fetchFormInfoForEditingFx,
});
sample({
	clock: fetchChartParametersFx.done,
	source: $editMode,
	filter: (sourceData) => {
		const { isEditing } = sourceData;
		return isEditing;
	},
	fn: (sourceData, clockData) => {
		const {
			result: { chartParameters },
		} = clockData;
		const {
			params: { formId },
		} = clockData;

		return {
			id: formId,
			...chartParameters,
			selectedObjects: [],
			isFormSelected: true,
			formDynamicObjects: [],
			formTransparentObjects: [],
			statusIndicators: [],
			objectParameters: new Map(),
			formParameters: [],
		};
	},
	target: setDataForEditing,
});
sample({
	clock: fetchChartParametersFx.done,
	source: $editMode,
	filter: (sourceData) => {
		const { isEditing } = sourceData;
		return isEditing;
	},
	fn: (sourceData, clockData) => {
		const { id, versionCode } = sourceData;
		const {
			params: { userId },
		} = clockData;
		return {
			formId: id || 0,
			versionCode,
			userId,
		};
	},
	target: fetchFormInfoForEditingFx,
});

$editMode.watch(fetchChartObjectsFx.done, (state, payload) => {
	const { chartData } = payload.result;
	const { versionCode } = state;
	Promise.all(
		chartData.map((item) => {
			fetchFormObjectsParametersQuerysFx({
				objectId: Number(item.id),
				versionCode: versionCode,
			});
		}),
	);
});
sample({
	clock: changeFormObjectLayerFx.done,
	source: [$editMode, $selectedObjectsState],
	fn: (state, payload) => {
		const { objectId, layerId } = payload.params;
		const [editMode, selectedObjectsState] = state as [
			EditMode,
			SelectedObjectsState,
		];
		const { formDynamicObjects, formTransparentObjects, statusIndicators } =
			editMode;
		const { selectedObjects } = selectedObjectsState;
		const objects = [
			...formTransparentObjects,
			...formDynamicObjects,
			...statusIndicators,
		];
		const formObject = objects.find((item) => item.id === objectId);
		return {
			...state,
			formDynamicObjects: formDynamicObjects.map((item) => {
				if (item.id === objectId)
					return {
						...item,
						layerId,
					};
				return item;
			}),
			formTransparentObjects: formTransparentObjects.map((item) => {
				if (item.id === objectId)
					return {
						...item,
						layerId,
					};
				return item;
			}),
			statusIndicators: statusIndicators.map((item) => {
				if (item.id === objectId)
					return {
						...item,
						layerId,
					};
				return item;
			}),
			selectedObjects: formObject
				? [...selectedObjects, formObject]
				: selectedObjects,
		};
	},
	target: setDataForEditing,
});
sample({
	clock: setActiveFormParameters,
	source: [$editMode, $activeForm],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode, Form];
		const { isEditing, formType } = editModeState;
		return isEditing && formType === FormTypes.ReportForm;
	},
	fn: (sourceData, clockData) => {
		const formState = clockData;
		return {
			...formState,
			selectedObjects: [],
			isFormSelected: true,
			formDynamicObjects: [],
			formTransparentObjects: [],
			statusIndicators: [],
			objectParameters: new Map(),
			formParameters: [],
		};
	},
	target: setDataForEditing,
});
sample({
	clock: setActiveFormParameters,
	source: [$editMode, $activeForm, $user],
	filter: (sourceData) => {
		const [editModeState] = sourceData as [EditMode, Form];
		const { isEditing, formType } = editModeState;
		return isEditing && formType === FormTypes.ReportForm;
	},
	fn: (sourceData, clockData) => {
		const [, , user] = sourceData as [EditMode, Form, User];
		const { id, versionCode } = clockData;
		return {
			formId: id || 0,
			versionCode: versionCode || 90,
			userId: user.preferredUsername || '',
		};
	},
	target: fetchFormInfoForEditingFx,
});
sample({
	source: [$editMode, $formLayers],
	clock: copyDynamicObjectFx.done,
	filter: (_sourceData, clockData) =>
		clockData.result.createdDynamicObjectId != null,
	fn: (sourceData, clockData) => {
		const { result, params } = clockData;
		const { id } = params;
		const { dynamicObject } = result;
		const [editMode, formLayers] = sourceData as [EditMode, FormLayers];
		const { formDynamicObjects } = editMode;
		const copiedDynamicObject = formDynamicObjects.find(
			(item) => item.id === id,
		);
		const { mainLayer } = formLayers;
		if (copiedDynamicObject) {
			(dynamicObject as DynamicObjectConfiguration).images = [
				...copiedDynamicObject.images,
			];
		}
		return {
			...result,
			dynamicObject: {
				...result.dynamicObject,
				layerId:
					result.dynamicObject.layerId == null
						? mainLayer.id
						: result.dynamicObject.layerId,
			},
			createdDynamicObjectId: result.createdDynamicObjectId || 0,
		};
	},
	target: addCreatedDynamicObject,
});
sample({
	source: [$editMode, $formLayers],
	clock: copyStatusIndicatorFx.done,
	filter: (_sourceData, clockData) =>
		clockData.result.createdStatusIndicatorId != null,
	fn: (sourceData, clockData) => {
		const { result } = clockData;
		const [, formLayers] = sourceData as [EditMode, FormLayers];

		const { mainLayer } = formLayers;
		return {
			...result,
			statusIndicator: {
				...result.statusIndicator,
				layerId:
					result.statusIndicator.layerId == null
						? mainLayer.id
						: result.statusIndicator.layerId,
			},
			createdStatusIndicatorId: result.createdStatusIndicatorId || 0,
		};
	},
	target: addStatusIndicator,
});
sample({
	source: [$editMode, $formLayers],
	clock: createTransparent,
	fn: (sourceData, clockData) => {
		const { x, y, userId } = clockData;
		const [editMode, layers] = sourceData as [EditMode, FormLayers];
		const { id } = editMode;
		const { formLayers } = layers;
		const mainLayerId =
			formLayers.find((item) => item.name === 'Основной')?.id || 1;

		return {
			x,
			y,
			formId: id || 0,
			userId,
			moduleName: ModuleName.CreateTransparent_watch_createTransparentFx,
			layerId: mainLayerId,
		};
	},
	target: createTransparentFx,
});
sample({
	source: [$editMode, $formLayers],
	clock: createDynamicObject,
	fn: (sourceData, clockData) => {
		const { x, y, userId } = clockData;
		const [editMode, layers] = sourceData as [EditMode, FormLayers];
		const { id } = editMode;
		const { formLayers } = layers;
		const mainLayerId =
			formLayers.find((item) => item.name === 'Основной')?.id || 1;

		return {
			x,
			y,
			formId: id || 0,
			userId,
			moduleName: ModuleName.CreateTransparent_watch_createTransparentFx,
			layerId: mainLayerId,
		};
	},
	target: createDynamicObjectFx,
});
sample({
	source: [$editMode, $formLayers],
	clock: createStatusIndicator,
	fn: (sourceData, clockData) => {
		const { x, y, userId } = clockData;
		const [editMode, layers] = sourceData as [EditMode, FormLayers];
		const { id } = editMode;
		const { formLayers } = layers;
		const mainLayerId =
			formLayers.find((item) => item.name === 'Основной')?.id || 1;

		return {
			x,
			y,
			formId: id || 0,
			userId,
			moduleName: ModuleName.CreateTransparent_watch_createTransparentFx,
			layerId: mainLayerId,
		};
	},
	target: createStatusIndicatorFx,
});

sample({
	source: $formLayers,
	clock: copyTransparentFx.done,
	filter: (sourceData, clockData) =>
		clockData.result.createdTransparentId != null,
	fn: (sourceData, clockData) => {
		const { result } = clockData;
		const { mainLayer } = sourceData;

		return {
			...result,
			transparentObject: {
				...result.transparentObject,
				layerId:
					result.transparentObject.layerId == null
						? mainLayer.id
						: result.transparentObject.layerId,
			},
			createdTransparentId: result.createdTransparentId || 0,
		};
	},
	target: addCreatedTransparent,
});
sample({
	clock: [setActiveFormLayer],
	source: [$editMode, $formLayers],
	fn: (state, formLayerId) => {
		if (formLayerId == null) return [];
		const [editMode, formLayersState] = state as [EditMode, FormLayers];
		const { formDynamicObjects, formTransparentObjects, statusIndicators } =
			editMode;
		const { formLayers, mainLayer } = formLayersState;
		const objects = [
			...formTransparentObjects,
			...formDynamicObjects,
			...statusIndicators,
		];
		const formLayer = formLayers.find((item) => item.id === formLayerId);
		if (formLayer && formLayer.name === mainLayer.name) {
			const layerId =
				formLayers.find((item) => item.id === formLayerId)?.layerId || 1;
			return objects.filter(
				(item) => item.layerId === layerId || item.layerId === formLayerId,
			);
		}
		return objects.filter((item) => item.layerId === formLayerId);
	},
	target: setSelectedObjects,
});

sample({
	clock: [deleteFormLayerFx.done],
	source: [$user, $editMode],
	fn: (state) => {
		const [user, editMode] = state as [User | null, EditMode];
		const { id } = editMode;
		return {
			userId: user?.preferredUsername || '',
			formId: id || 0,
			moduleName: ModuleName.UseCurrentFormTreeLayers_getCurrentFormLayersFx,
		};
	},
	target: getCurrentFormLayersFx,
});
sample({
	clock: [createFormLayerFx.done],
	source: [$user, $editMode],
	fn: (state) => {
		const [user, editMode] = state as [User | null, EditMode];
		const { id } = editMode;
		return {
			userId: user?.preferredUsername || '',
			formId: id || 0,
			moduleName: ModuleName.UseCurrentFormTreeLayers_getCurrentFormLayersFx,
		};
	},
	target: getCurrentFormLayersFx,
});
sample({
	clock: [replaceFormLayerFx.done],
	source: [$user, $editMode],
	fn: (state) => {
		const [user, editMode] = state as [User | null, EditMode];
		const { id } = editMode;
		return {
			userId: user?.preferredUsername || '',
			formId: id || 0,
			moduleName: ModuleName.UseCurrentFormTreeLayers_getCurrentFormLayersFx,
		};
	},
	target: getCurrentFormLayersFx,
});
sample({
	clock: addImage,
	source: [$formContextMenu, $editMode],
	fn: (state, image) => {
		const [formContextMenu] = state as [FormContextMenuModel, EditMode];
		const { object } = formContextMenu;
		const { images } = object as DynamicObjectConfiguration;
		const newImages = [
			...images,
			{
				...image,
			},
		];
		return {
			id: object?.id || 0,
			images: newImages,
		};
	},
	target: setDynamicObjectImages,
});

sample({
	clock: setContextMenuObjectById,
	source: $editMode,
	fn: (state, id) => {
		const { formDynamicObjects, formTransparentObjects, statusIndicators } =
			state;
		const object = [
			...formTransparentObjects,
			...formDynamicObjects,
			...statusIndicators,
		].find((item) => item.id === id);
		return object || formTransparentObjects[0];
	},
	target: setContextMenuObject,
});

export const $objectsConfigHistory = createStore<ObjectConfigTreeOpenState[]>(
	[],
);

sample({
	clock: setConfigTreeItemOpenState,
	source: [$editMode, $objectsConfigHistory],
	fn: (state, { type, treeItem }) => {
		const [editMode, objectsConfigHistory] = state as [
			EditMode,
			ObjectConfigTreeOpenState[],
		];
		const { selectedObjectConfig } = editMode;
		if (
			!objectsConfigHistory.some((item) => {
				return item.type === type;
			})
		)
			return [
				...objectsConfigHistory,
				{
					type,
					config: selectedObjectConfig.map((configItem) => {
						if (configItem.id === treeItem.id)
							return { ...treeItem, isOpen: !treeItem.isOpen };
						return configItem;
					}),
				},
			];
		return objectsConfigHistory.map((item) => {
			if (item.type === type) {
				return {
					type,
					config: item.config.map((configItem) => {
						if (configItem.id === treeItem.id)
							return { ...treeItem, isOpen: !treeItem.isOpen };
						return configItem;
					}),
				};
			}
			return item;
		});
	},
	target: setConfigTreeOpenState,
});

$objectsConfigHistory.on(
	setConfigTreeOpenState,
	(objectConfigTreeOpenState, payload) => {
		return payload;
	},
);

sample({
	clock: setObjectSelectedStatus,
	source: [$editMode, $selectedObjectsState],
	fn: (state, payload) => {
		const [editMode, selectedObjectsState] = state as [
			EditMode,
			SelectedObjectsState,
		];
		const { formTransparentObjects, statusIndicators, formDynamicObjects } =
			editMode;
		const { selectedObjects } = selectedObjectsState;
		const { objectId, isMultipleSelection } = payload;
		const objects = [
			...formTransparentObjects,
			...formDynamicObjects,
			...statusIndicators,
		];
		// если шифт зажат при выборе
		if (isMultipleSelection) {
			// чекаем есть ли объект в списке выбранных
			const selectedFormObject = selectedObjects.find(
				(item) => item.id === objectId,
			);
			if (selectedFormObject) {
				return selectedObjects.filter((item) => item.id !== objectId);
			}
			const formObject = objects.find((item) => item.id === objectId);
			if (formObject) {
				return [...selectedObjects, formObject];
			}
		}
		// если шифт не зажат при выборе
		const formObject = objects.find((item) => item.id === objectId);
		if (formObject) {
			return [formObject];
		}
		return [];
	},
	target: setSelectedObjects,
});
sample({
	clock: setObjectSelectedStatus,
	fn: () => {
		return false;
	},
	target: setFormSelectedStatus,
});
sample({
	clock: updateObjectParameter,
	source: $selectedObjectsState,
	fn: (state, payload) => {
		const {
			objectId,
			value,
			parameterName,
			pairedParameterName,
			pairedParameterValue,
		} = payload;
		const { selectedObjects } = state;

		const updatedSelectedObjects = selectedObjects.map((object) => {
			if (object.id === objectId) {
				return {
					...object,
					[parameterName]: value,
					...(pairedParameterName && {
						[pairedParameterName]: pairedParameterValue,
					}),
				};
			}
			return object;
		});
		return updatedSelectedObjects;
	},
	target: setSelectedObjects,
});

$selectedObjectsState.on(setSelectedObjects, (state, selectedObjects) => {
	return {
		...state,
		isFormSelected: false,
		selectedObjects,
	};
});
sample({
	clock: [
		$selectedObjectsState,
		$multichartSettings,
		fetchFormObjectsParametersQuerysFx.done,
		updateFormParameterFx.done,
	],
	source: [
		$editMode,
		$formLayers,
		$multichartSettings,
		$selectedObjectsState,
		$objectsConfigHistory,
	],
	filter: (state) => {
		const [editMode] = state as [EditMode];
		const { formType } = editMode;
		return formType !== FormTypes.MultiChart;
	},
	fn: (state) => {
		const [
			editMode,
			formLayersState,
			multichartSettings,
			selectedObjectsState,
			objectsConfigHistory,
		] = state as [
			EditMode,
			FormLayers,
			MultichartSettingsModel,
			SelectedObjectsState,
			ObjectConfigTreeOpenState[],
		];
		const { formType, objectParameters, formParameters } = editMode;
		const { activeId } = multichartSettings;
		console.log(activeId);
		const { checkedFormLayers } = formLayersState;
		const { selectedObjects, isFormSelected } = selectedObjectsState;

		const filteredSelectedObjects = selectedObjects.filter((item) =>
			checkedFormLayers.includes(item.layerId),
		);

		if (isFormSelected) {
			const configTree = createConfigurationTree({
				configItems: sortConfigurationItems(formParameters),
				type: formType,
				objectsConfigHistory,
			});
			return configTree;
		}
		// Return multichart trend parameters
		if (formType === FormTypes.MultiChart) {
			const params: FormObjectParameters[] | undefined =
				objectParameters.get(activeId);
			console.log(params);
			if (params) {
				const configTree = createConfigurationTree({
					configItems: sortConfigurationItems(params),
					type: formType,
					objectsConfigHistory,
				});
				return configTree;
			}
			return [];
		}
		if (filteredSelectedObjects.length === 1) {
			const configList = objectParameters.get(filteredSelectedObjects[0].id);
			if (configList) {
				const configTree = createConfigurationTree({
					configItems: sortConfigurationItems(configList),
					type: filteredSelectedObjects[0].objectType,
					objectsConfigHistory,
				});
				return configTree;
			}
			return [];
		}
		if (filteredSelectedObjects.length >= 2) {
			const configList = objectParameters.get(filteredSelectedObjects[0].id);
			if (configList) {
				const groupConfig = configList.filter(
					(item) => item.possibilityForGroupChange,
				);
				// поиск одинаковых значений свойств у выбранных объектов
				const objectValues: Map<string, FormObjectValue[]> = new Map();
				for (const formObject of filteredSelectedObjects) {
					for (let key in formObject) {
						const objectPropertyValues = objectValues.get(key);
						if (objectPropertyValues)
							objectValues.set(key, [
								...objectPropertyValues,
								formObject[key as keyof FormObjectConfiguration],
							]);
						else
							objectValues.set(key, [
								formObject[key as keyof FormObjectConfiguration],
							]);
					}
				}
				const editedGroupConfig = groupConfig.map((item) => {
					const values = objectValues.get(item.parameterName);
					if (values) {
						if (values.every((v) => v === values[0])) return item;
						else
							return {
								...item,
								value: null,
							};
					}
					return item;
				});
				const configTree = createConfigurationTree({
					configItems: sortConfigurationItems(editedGroupConfig),
					type: filteredSelectedObjects[0].objectType,
					objectsConfigHistory,
				});
				return configTree;
			}
			return [];
		}

		return [];
	},
	target: setSelectedObjectConfig,
});

sample({
	clock: [fetchFormObjectsParametersQuerysFx.done],
	source: [$editMode, $objectsConfigHistory],
	filter: (state) => {
		const [editMode] = state as [EditMode];
		const { formType } = editMode;
		return formType === FormTypes.MultiChart;
	},
	fn: (state, clockData) => {
		const [editMode, objectsConfigHistory] = state as [
			EditMode,
			ObjectConfigTreeOpenState[],
		];
		const {
			result: { objectParameters },
		} = clockData;
		const { formType } = editMode;
		// Return multichart trend parameters
		if (formType === FormTypes.MultiChart) {
			const configTree = createConfigurationTree({
				configItems: sortConfigurationItems(objectParameters),
				type: formType,
				objectsConfigHistory,
			});
			return configTree;
		}

		return [];
	},
	target: setSelectedObjectConfig,
});

$editMode.on(setSelectedObjectConfig, (state, selectedObjectConfig) => {
	return {
		...state,
		selectedObjectConfig,
	};
});
$editMode.on(setConfigTreeItemOpenState, (state, { treeItem }) => {
	return {
		...state,
		selectedObjectConfig: state.selectedObjectConfig.map((item) => {
			if (item.id === treeItem.id)
				return {
					...item,
					isOpen: !item.isOpen,
				};
			return item;
		}),
	};
});
$selectedObjectsState.on(resetSelection, (state) => {
	return {
		...state,
		isFormSelected: false,
		selectedObjects: [],
	};
});
sample({
	clock: [deleteTransparent, deleteDynamicObject, deleteStatusIndicator],
	source: [$selectedObjectsState],
	fn: (state, payload) => {
		const [selectedObjectsState] = state as [SelectedObjectsState];
		const { selectedObjects } = selectedObjectsState;
		return selectedObjects.filter((obj) => obj.id !== payload);
	},
	target: setSelectedObjects,
});

$selectedObjectsState.on(setFormSelectedStatus, (state, isFormSelected) => {
	// если выбрали форму, то снимаем выделение с объектов
	if (isFormSelected)
		return {
			...state,
			isFormSelected,
			selectedObjects: [],
		};
	return {
		...state,
		isFormSelected,
	};
});
