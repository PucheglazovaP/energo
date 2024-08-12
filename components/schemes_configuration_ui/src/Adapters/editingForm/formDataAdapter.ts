import {
	FormObjectParameters,
	FormObjectParametersResponse,
	FormParametersResponse,
} from '../../Models/EditMode/types';
import { formObjectProperties } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	ObjectTypes,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { convertColor } from '../../Utils/convertColor';

export function formParametersAdapter(result: string) {
	const data: FormParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(data) && data.length > 0) {
		return data.map((item) => {
			return {
				parameterCode: item.КодПараметра,
				parameterName:
					formObjectProperties[
						item.НазваниеПараметра as keyof typeof formObjectProperties
					] || item.НазваниеПараметра,
				parameterForDisplay: item.НазваниеДляОтображения,
				comment: item.Комментарий,
				dataType: item.ТипДанныхПараметра,
				codeTypeDelphi: item.КодТипаДанныхDelphiПараметра,
				dataTypeDelphi: item.ТипДанныхDelphiПараметра,
				value: item.ЗначениеПараметра,
				defaultValue: item.ЗначениеПоУмолчаниюПараметра,
				visibilityForUser:
					item.ПризнакВидимостиДляПользователя || item.ВидимоеДляПользователя,
				possibleDependency: item.ПризнакВозможнойЗависимости,
				groupNumber: item.ПорядковыйНомерГруппы,
				groupName: item.НазваниеГруппы,
				numberInGroup: item.НомерПоПорядкуВГруппе,
				possibilityForGroupChange: item.ВозможностьГрупповогоИзмененияЗначений,
				possibleValues: item.ПеречислениеВозможныхЗначений
					? JSON.parse(item.ПеречислениеВозможныхЗначений).map(
							(item: { Val: string; DisplayName: string }) => ({
								value: item.Val,
								displayValue: item.DisplayName,
							}),
					  )
					: null,
			};
		});
	}

	return [];
}
export function formObjectsParametersAdapter(result: string) {
	const objectParametersList: FormObjectParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(objectParametersList) && objectParametersList.length > 0) {
		const objectParameters: FormObjectParameters[] = objectParametersList.map(
			(item) => {
				return {
					parameterCode: item.КодПараметра,
					parameterName:
						formObjectProperties[
							item.НазваниеПараметра as keyof typeof formObjectProperties
						],
					parameterForDisplay: item.НазваниеДляОтображения,
					comment: item.Комментарий,
					dataType: item.ТипДанныхПараметра,
					codeTypeDelphi: item.КодТипаДанныхDelphiПараметра,
					dataTypeDelphi: item.ТипДанныхDelphiПараметра,
					value: getValue(
						item.ТипДанныхDelphiПараметра,
						item.ЗначениеПараметра,
					),
					defaultValue: item.ЗначениеПоУмолчаниюПараметра,
					visibilityForUser:
						item.ПризнакВидимостиДляПользователя || item.ВидимоеДляПользователя,
					possibleDependency: item.ПризнакВозможнойЗависимости,
					pairedParameterCode: item.КодПарногоПараметра,
					objectId: item.КодОбъектаФормы,
					possibleValues: item.ПеречислениеВозможныхЗначений
						? JSON.parse(item.ПеречислениеВозможныхЗначений).map(
								(item: { Val: string; DisplayName: string }) => ({
									value: item.Val,
									displayValue: item.DisplayName,
								}),
						  )
						: null,
					groupNumber: item.ПорядковыйНомерГруппы,
					groupName: item.НазваниеГруппы,
					numberInGroup: item.НомерПоПорядкуВГруппе,
					possibilityForGroupChange:
						item.ВозможностьГрупповогоИзмененияЗначений,
				};
			},
		);
		return objectParameters;
	}
	return [];
}
export function createdTransparentDataAdapter(result: string) {
	const objectParametersList: FormObjectParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(objectParametersList) && objectParametersList.length > 0) {
		const createdTransparentId = objectParametersList[0].КодОбъектаФормы;
		let layerId = 1;
		const objectParameters: FormObjectParameters[] = objectParametersList.map(
			(item, index) => {
				if (index === 0) layerId = item.Слой;
				return {
					parameterCode: item.КодПараметра,
					parameterName:
						formObjectProperties[
							item.НазваниеПараметра as keyof typeof formObjectProperties
						],
					parameterForDisplay:
						item.НазваниеДляОтображения || item.НазваниеПараметраДляОтображения,
					comment: item.Комментарий,
					dataType: item.ТипДанныхПараметра,
					codeTypeDelphi: item.КодТипаДанныхDelphiПараметра,
					dataTypeDelphi:
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
					value: getValue(
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
						item.ЗначениеПараметра,
					),
					defaultValue: item.ЗначениеПоУмолчаниюПараметра,
					visibilityForUser:
						item.ПризнакВидимостиДляПользователя || item.ВидимоеДляПользователя,
					possibleDependency: item.ПризнакВозможнойЗависимости,
					pairedParameterCode: item.КодПарногоПараметра,
					possibleValues: item.ПеречислениеВозможныхЗначений
						? JSON.parse(item.ПеречислениеВозможныхЗначений).map(
								(item: { Val: string; DisplayName: string }) => ({
									value: item.Val,
									displayValue: item.DisplayName,
								}),
						  )
						: null,
					groupNumber: item.ПорядковыйНомерГруппы,
					groupName: item.НазваниеГруппы,
					numberInGroup: item.НомерПоПорядкуВГруппе,
					possibilityForGroupChange:
						item.ВозможностьГрупповогоИзмененияЗначений,
					objectId: item.КодОбъектаФормы,
				};
			},
		);
		const transparentObject: Partial<TransparentConfiguration> =
			objectParameters.reduce(
				(prev, item) => ({
					...prev,
					[item.parameterName]: item.value,
				}),
				{},
			);
		transparentObject.id = createdTransparentId;
		transparentObject.objectType = ObjectTypes.Transparent;

		transparentObject.layerId = layerId;
		return { objectParameters, createdTransparentId, transparentObject };
	}
	return {
		objectParameters: [],
		createdTransparentId: null,
		transparentObject: {},
	};
}
export function createdDynamicDataAdapter(result: string): {
	objectDynamicParameters: FormObjectParameters[];
	createdDynamicObjectId: number | null;
	dynamicObject: Partial<DynamicObjectConfiguration>;
} {
	const objectParametersList: FormObjectParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(objectParametersList) && objectParametersList.length > 0) {
		const createdDynamicObjectId = objectParametersList[0].КодОбъектаФормы;
		let layerId = 1;

		const objectDynamicParameters: FormObjectParameters[] =
			objectParametersList.map((item, index) => {
				if (index === 0) layerId = item.Слой;
				return {
					parameterCode: item.КодПараметра,
					parameterName:
						formObjectProperties[
							item.НазваниеПараметра as keyof typeof formObjectProperties
						],
					parameterForDisplay:
						item.НазваниеДляОтображения || item.НазваниеПараметраДляОтображения,
					comment: item.Комментарий,
					dataType: item.ТипДанныхПараметра,
					codeTypeDelphi: item.КодТипаДанныхDelphiПараметра,
					dataTypeDelphi:
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
					value: getValue(
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
						item.ЗначениеПараметра,
					),
					defaultValue: item.ЗначениеПоУмолчаниюПараметра,
					visibilityForUser:
						item.ПризнакВидимостиДляПользователя || item.ВидимоеДляПользователя,
					possibleDependency: item.ПризнакВозможнойЗависимости,
					pairedParameterCode: item.КодПарногоПараметра,
					possibleValues: item.ПеречислениеВозможныхЗначений
						? JSON.parse(item.ПеречислениеВозможныхЗначений).map(
								(item: { Val: string; DisplayName: string }) => ({
									value: item.Val,
									displayValue: item.DisplayName,
								}),
						  )
						: null,
					groupNumber: item.ПорядковыйНомерГруппы,
					groupName: item.НазваниеГруппы,
					numberInGroup: item.НомерПоПорядкуВГруппе,
					possibilityForGroupChange:
						item.ВозможностьГрупповогоИзмененияЗначений,
					objectId: item.КодОбъектаФормы,
				};
			});
		const dynamicObject: Partial<DynamicObjectConfiguration> =
			objectDynamicParameters.reduce(
				(prev, item) => ({
					...prev,
					[item.parameterName]: item.value,
				}),
				{},
			);
		dynamicObject.id = createdDynamicObjectId;
		dynamicObject.objectType = ObjectTypes.DynamicObject;
		dynamicObject.images = [];
		dynamicObject.layerId = layerId;
		return {
			objectDynamicParameters,
			createdDynamicObjectId,
			dynamicObject,
		};
	}
	let dynamicObject: Partial<DynamicObjectConfiguration> = {};
	let objectDynamicParameters: FormObjectParameters[] = [];
	return {
		objectDynamicParameters,
		createdDynamicObjectId: null,
		dynamicObject,
	};
}
export function createdStatusIndicatorDataAdapter(result: string): {
	statusIndicatorParameters: FormObjectParameters[];
	createdStatusIndicatorId: number | null;
	statusIndicator: Partial<DynamicObjectConfiguration>;
} {
	const objectParametersList: FormObjectParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(objectParametersList) && objectParametersList.length > 0) {
		const createdStatusIndicatorId = objectParametersList[0].КодОбъектаФормы;
		let layerId = 1;

		const statusIndicatorParameters: FormObjectParameters[] =
			objectParametersList.map((item, index) => {
				if (index === 0) layerId = item.Слой;
				return {
					parameterCode: item.КодПараметра,
					parameterName:
						formObjectProperties[
							item.НазваниеПараметра as keyof typeof formObjectProperties
						],
					parameterForDisplay:
						item.НазваниеДляОтображения || item.НазваниеПараметраДляОтображения,
					comment: item.Комментарий,
					dataType: item.ТипДанныхПараметра,
					codeTypeDelphi: item.КодТипаДанныхDelphiПараметра,
					dataTypeDelphi:
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
					value: getValue(
						item.ТипДанныхDelphiПараметра || item.НазваниеТипаДанныхDelphi,
						item.ЗначениеПараметра,
					),
					defaultValue: item.ЗначениеПоУмолчаниюПараметра,
					visibilityForUser:
						item.ПризнакВидимостиДляПользователя || item.ВидимоеДляПользователя,
					possibleDependency: item.ПризнакВозможнойЗависимости,
					pairedParameterCode: item.КодПарногоПараметра,
					possibleValues: item.ПеречислениеВозможныхЗначений
						? JSON.parse(item.ПеречислениеВозможныхЗначений).map(
								(item: { Val: string; DisplayName: string }) => ({
									value: item.Val,
									displayValue: item.DisplayName,
								}),
						  )
						: null,
					groupNumber: item.ПорядковыйНомерГруппы,
					groupName: item.НазваниеГруппы,
					numberInGroup: item.НомерПоПорядкуВГруппе,
					possibilityForGroupChange:
						item.ВозможностьГрупповогоИзмененияЗначений,
					objectId: item.КодОбъектаФормы,
				};
			});
		const statusIndicator: Partial<StatusIndicatorConfiguration> =
			statusIndicatorParameters.reduce(
				(prev, item) => ({
					...prev,
					[item.parameterName]: item.value,
				}),
				{},
			);
		statusIndicator.id = createdStatusIndicatorId;
		statusIndicator.objectType = ObjectTypes.StatusIndicator;
		statusIndicator.images = [];
		statusIndicator.layerId = layerId;
		return {
			statusIndicatorParameters,
			createdStatusIndicatorId,
			statusIndicator,
		};
	}
	let statusIndicator: Partial<DynamicObjectConfiguration> = {};
	let statusIndicatorParameters: FormObjectParameters[] = [];
	return {
		statusIndicatorParameters,
		createdStatusIndicatorId: null,
		statusIndicator,
	};
}
export function objectsParametersSelectedStatusAdapter(
	formObjects: (DynamicObjectConfiguration | TransparentConfiguration)[],
) {
	if (Array.isArray(formObjects) && formObjects.length > 0) {
		const objectsWithStatus = formObjects.map((item) => ({
			...item,
			selected: false,
		}));
		return objectsWithStatus;
	}
	return [];
}
function getValue(dataType: string, value: string) {
	switch (dataType) {
		case 'Integer': {
			return Number(value);
		}
		case 'TColor': {
			return convertColor(value);
		}
		case 'Boolean': {
			return Boolean(Number(value));
		}
		default: {
			return value;
		}
	}
}
export default {};
