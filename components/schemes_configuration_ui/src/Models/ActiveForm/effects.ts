import { createEffect } from 'effector';

import { transparentEmergencyEventsCountAdapter } from '../../Adapters/emergencyEvents/transparentEmergencyEventsCountAdapter';
import {
	formObjectLayerIdAdapter,
	formObjectsFormatter,
	formObjectsValueByLayersAdapter,
	formParametersAdapter,
} from '../../Adapters/formDataAdapter';
import { formObjectValueAdapter } from '../../Adapters/formDataAdapter';
import { formDynamicObjectValuesAdapter } from '../../Adapters/formDataAdapter';
import fetchFormLayersAdapter from '../../Adapters/formLayers/formLayersAdapter';
import fetchSystemLayersAdapter from '../../Adapters/formLayers/systemLayersAdapter';
import imageAdapter from '../../Adapters/imageAdapter';
import { getTransparentEmergencyEventsCount } from '../../Const/Queries/emergencyEvents';
import {
	getFormBackgroundQuery,
	getFormParametersQuery,
} from '../../Const/Queries/form';
import { getFormLayers, getSystemLayers } from '../../Const/Queries/formLayers';
import {
	getFormDynamicObjectValuesQuery,
	getFormObjectDataByLayersQuery,
	getFormObjectDataQuery,
	getFormObjectsQuery,
	getInfoAboutDynamicObjects,
	getInfoAboutTransparents,
} from '../../Const/Queries/formObjects';
import { getImageQuery } from '../../Const/Queries/image';
import {
	FetchFormObjectsParams,
	FetchFormObjectValueParams,
	FetchFormParametersParams,
	FetchTransparentEmergencyEventsCount,
	FormLayer,
	FormTypes,
	GetFormLayersParams,
	ObjectValue,
	StatusIndicatorValue,
	SystemLayer,
	SystemLayersInfoParams,
} from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	DynamicObjectValue,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import {
	checkResponseOutputWarnings,
	handleError,
} from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	fetchObjectValues,
	setActiveFormParameters,
	setActiveFormTitle,
	setActiveFormType,
	setDynamicObjectImages,
	setDynamicObjectImageUrl,
	setDynamicObjectValue,
	setFormObjectsValue,
	setFormObjectValue,
} from './events';
import { Form, FormBackground, ImageInfo } from './types';

function handleErrorResponse({ error }: { error: Error }) {
	handleError(error);
	setActiveFormParameters({ isLoading: false });
}

export const fetchFormParametersFx = createEffect(
	async (params: FetchFormParametersParams) => {
		const formData = await rpcQuery<Partial<Form>>(
			getFormParametersQuery(params),
			formParametersAdapter,
			checkResponseOutputWarnings,
		);
		return { formData };
	},
);

fetchFormParametersFx.done.watch(({ params, result }) => {
	const { formData } = result;
	const { versionCode } = params;
	setActiveFormParameters({ id: params.formId, ...formData, versionCode });
});
fetchFormParametersFx.fail.watch(handleErrorResponse);

export const fetchFormBackgroundFx = createEffect(async (formId: number) => {
	const formBackground = await rpcQuery<Promise<FormBackground>>(
		getFormBackgroundQuery(formId),
		imageAdapter,
		checkResponseOutputWarnings,
	);
	return { formBackground };
});

fetchFormBackgroundFx.done.watch(({ result }) => {
	const {
		formBackground: { image },
	} = result;
	if (image) {
		setActiveFormParameters({
			formBackground: image,
		});
	}
	// to do подумать над пустой картинкой
	else
		setActiveFormParameters({
			formBackground: '',
		});
});

fetchFormBackgroundFx.fail.watch(handleErrorResponse);

export const fetchFormObjectsFx = createEffect(
	async ({ formId, versionCode }: FetchFormObjectsParams) => {
		const { formTransparentObjects, formDynamicObjects, statusIndicators } =
			await rpcQuery<{
				formTransparentObjects: TransparentConfiguration[];
				formDynamicObjects: DynamicObjectConfiguration[];
				statusIndicators: StatusIndicatorConfiguration[];
			}>(
				getFormObjectsQuery(formId, versionCode),
				formObjectsFormatter,
				checkResponseOutputWarnings,
			);
		return { formTransparentObjects, formDynamicObjects, statusIndicators };
	},
);
fetchFormObjectsFx.done.watch(({ params, result }) => {
	const { formTransparentObjects, formDynamicObjects, statusIndicators } =
		result;
	const { formId } = params;
	setActiveFormParameters({
		formTransparentObjects,
		formDynamicObjects,
		statusIndicators,
	});
	fetchFormDynamicObjectValuesFx(formId);
	fetchObjectValues();
});

fetchFormObjectsFx.fail.watch(handleErrorResponse);
export const fetchFormDynamicObjectValuesFx = createEffect(
	async (formId: number) => {
		const images = await rpcQuery<
			Array<DynamicObjectValue & { objectId: number }>
		>(
			getFormDynamicObjectValuesQuery(formId),
			formDynamicObjectValuesAdapter,
			checkResponseOutputWarnings,
		);
		return images;
	},
);
fetchFormDynamicObjectValuesFx.done.watch(({ result }) => {
	const images = result;
	setDynamicObjectImages(images);
});
fetchFormDynamicObjectValuesFx.fail.watch(handleErrorResponse);

export const fetchObjectImageFx = createEffect(
	async ({ formId, fileName }: { formId: number; fileName: string }) => {
		const imageInfo = await rpcQuery<Promise<ImageInfo>>(
			getImageQuery(fileName, formId),
			imageAdapter,
			checkResponseOutputWarnings,
		);
		return { imageInfo };
	},
);
fetchObjectImageFx.done.watch(({ result }) => {
	const {
		imageInfo: { image, fileName },
	} = result;
	if (image) {
		setDynamicObjectImageUrl({
			url: image,
			fileName,
		});
	} else
		setDynamicObjectImageUrl({
			url: '',
			fileName,
		});
});

fetchObjectImageFx.fail.watch(handleErrorResponse);

export const fetchFormObjectValueFx = createEffect(
	async ({
		objectId,
		gr,
		visdelay,
		datatype,
		round,
		isDynamicObject,
		mode,
	}: FetchFormObjectValueParams) => {
		const { objectValue, nulls, canerr } = await rpcQuery<ObjectValue>(
			getFormObjectDataQuery({
				gr,
				visdelay,
				datatype,
				round: round != undefined ? round : 10,
				mode: mode || 3,
			}),
			formObjectValueAdapter,
			checkResponseOutputWarnings,
		);
		return { objectValue, nulls, canerr, isDynamicObject, objectId };
	},
);
export const fetchFormObjectsValueByLayersFx = createEffect(
	async ({ layers, userId }: { layers: number[]; userId: string }) => {
		const formObjectData = await rpcQuery<
			StatusIndicatorValue[] | ObjectValue[]
		>(
			getFormObjectDataByLayersQuery(layers, userId),
			formObjectsValueByLayersAdapter,
			checkResponseOutputWarnings,
		);
		return formObjectData;
	},
);
fetchFormObjectValueFx.done.watch(({ result }) => {
	const { objectValue, isDynamicObject, objectId, nulls, canerr } = result;
	if (isDynamicObject) setDynamicObjectValue({ objectId, objectValue });
	else setFormObjectValue({ objectId, objectValue, nulls, canerr });
});
fetchFormObjectsValueByLayersFx.done.watch(({ result }) => {
	setFormObjectsValue(result);
});
fetchFormObjectValueFx.fail.watch(handleErrorResponse);

export const fetchFormInfoFx = createEffect(
	async ({
		id,
		title,
		formType,
		versionCode,
		userId,
	}: {
		id: number;
		title: string;
		formType: FormTypes;
		versionCode: number;
		userId: string;
	}) => {
		setActiveFormParameters({ title, formType });
		setActiveFormTitle(title);
		setActiveFormType(formType);
		await fetchFormBackgroundFx(id);
		Promise.all([
			fetchFormParametersFx({ formId: id, versionCode, userId }),
			fetchFormObjectsFx({ formId: id, versionCode, userId }),
		]);
	},
);
export const fetchTransparentEmergencyEventsCountFx = createEffect(
	async (params: FetchTransparentEmergencyEventsCount) => {
		const result = await rpcQuery(
			getTransparentEmergencyEventsCount(params),
			transparentEmergencyEventsCountAdapter,
			checkResponseOutputWarnings,
		);
		return { ...result, transparentId: params.transparentId };
	},
);
export const fetchTransparentsLayerIdFx = createEffect(
	async ({ formId, versionCode }: { formId: number; versionCode: number }) => {
		const result = await rpcQuery(
			getInfoAboutTransparents(formId, versionCode),
			formObjectLayerIdAdapter,
			checkResponseOutputWarnings,
		);
		return result;
	},
);
export const fetchDynamicObjectsLayerIdFx = createEffect(
	async ({ formId, versionCode }: { formId: number; versionCode: number }) => {
		const result = await rpcQuery(
			getInfoAboutDynamicObjects(formId, versionCode),
			formObjectLayerIdAdapter,
			checkResponseOutputWarnings,
		);
		return result;
	},
);

export const getCurrentFormLayersFx = createEffect(
	async (params: GetFormLayersParams) => {
		const systemLayersList = await rpcQuery<FormLayer[]>(
			getFormLayers(params),
			fetchFormLayersAdapter,
		);
		return systemLayersList;
	},
);
export const getSystemLayersFx = createEffect(
	async (params: SystemLayersInfoParams) => {
		const systemLayersList = await rpcQuery<SystemLayer[]>(
			getSystemLayers(params),
			fetchSystemLayersAdapter,
		);
		return systemLayersList;
	},
);
getSystemLayersFx.fail.watch(handleErrorResponse);
getCurrentFormLayersFx.fail.watch(handleErrorResponse);
