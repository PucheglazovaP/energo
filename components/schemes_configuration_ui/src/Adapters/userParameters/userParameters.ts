import { format } from 'date-fns';

import {
	AddUserParameterOptionResponse,
	AddUserParameterResponse,
	GetUserParameterFileResponse,
	SaveUserParameterValueResponse,
	SetAllObjectsValueResponse,
	UpdateUserParameterResponse,
} from '../../Const/Queries/userParameters/types';
import {
	NSIUserParameter,
	NSIUserParameterDataType,
	NSIUserParameterFilesListItem,
	NSIUserParameterOption,
} from '../../Models/NSIUserParameters/types';

import {
	RequestedAddUserParameter,
	RequestedAddUserParameterOption,
	RequestedAllObjectsValue,
	RequestedUpdateUserParameter,
	RequestedUserParameter,
	RequestedUserParameterDataType,
	RequestedUserParameterOption,
	RequestedUserParameterValue,
	RequestedUserPrameterFile,
	RequestedUserPrameterFilesListItem,
} from './types';

export function userParametersAdapter(response: string): NSIUserParameter[] {
	const requestedUserParametersList: RequestedUserParameter[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const userParametersList: NSIUserParameter[] =
		requestedUserParametersList.map((requestedUserParameter) => ({
			id: requestedUserParameter.КодПараметра,
			name: requestedUserParameter.НазваниеПараметра,
			dataTypeId: requestedUserParameter.КодТипаДанныхПараметра,
			dataType: requestedUserParameter.ТипДанныхПараметра,
			comment: requestedUserParameter.Комментарий,
			lastModified: requestedUserParameter.LastModified_ДинамическогоПараметра,
			valueId: requestedUserParameter.КодЗначенияПараметра,
			value: requestedUserParameter.ЗначениеПараметра,
			valueLastModified: requestedUserParameter.LastModified_ЗначенияПараметра,
			touched: false,
			expanded: true,
			deleted: false,
		}));

	return userParametersList;
}

export function userParameterOptionsAdapter(
	response: string,
): NSIUserParameterOption[] {
	const requestedUserParameterOptions: RequestedUserParameterOption[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const userParameterOptions: NSIUserParameterOption[] =
		requestedUserParameterOptions.map((requestedUserParameterOption) => ({
			valueId: requestedUserParameterOption.КодВозможногоЗначения,
			value: requestedUserParameterOption.Значение,
			lastModified: requestedUserParameterOption.LastModified,
			touched: false,
			deleted: false,
		}));

	return userParameterOptions;
}

export function setAllObjectsValueAdapter(
	response: string,
): SetAllObjectsValueResponse {
	const { RowsUpdated: rowsUpdated }: RequestedAllObjectsValue =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		rowsUpdated,
	};
}

export function userParameterFilesListAdapter(
	response: string,
): NSIUserParameterFilesListItem[] {
	const requestedUserParameterFilesList: RequestedUserPrameterFilesListItem[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const userParameterFilesList: NSIUserParameterFilesListItem[] =
		requestedUserParameterFilesList.map(
			(requestedUserParameterFilesListItem) => ({
				id: requestedUserParameterFilesListItem.Код,
				name: requestedUserParameterFilesListItem.Наименование,
				uploadDate: format(
					new Date(requestedUserParameterFilesListItem.ДатаЗагрузки),
					'dd.MM.yyyy, HH:mm',
				),
				checked: false,
			}),
		);

	return userParameterFilesList;
}

export function userParameterFileAdapter(
	response: string,
): GetUserParameterFileResponse {
	const { BASE64_FILE: content }: RequestedUserPrameterFile =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		content,
	};
}

export function saveUserParameterValueAdapter(
	response: string,
): SaveUserParameterValueResponse {
	const parsedResponse: RequestedUserParameterValue =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		rowsUpdated: parsedResponse.RowsUpdated,
		valueId: parsedResponse.КодЗначения,
		lastModified: parsedResponse.LastModified,
		fileId: parsedResponse.КодФайла,
	};
}

export function userParameterDataTypesAdapter(
	response: string,
): NSIUserParameterDataType[] {
	const requestedUserParameterFilesList: RequestedUserParameterDataType[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const userParameterDataTypes: NSIUserParameterDataType[] =
		requestedUserParameterFilesList.map((requestedUserParameterDataType) => ({
			typeId: requestedUserParameterDataType.Код,
			typeName: requestedUserParameterDataType.ТипДанных,
		}));

	return userParameterDataTypes;
}

export function addUserParameterAdapter(
	response: string,
): AddUserParameterResponse {
	const requestedAddUserParameter: RequestedAddUserParameter =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		rowsUpdated: requestedAddUserParameter.RowsUpdated,
		parameterId: requestedAddUserParameter.КодСозданногоПараметра,
		lastModified: requestedAddUserParameter.LastModified,
	};
}

export function addUserParameterOptionAdapter(
	response: string,
): AddUserParameterOptionResponse {
	const requestedAddUserParameterOption: RequestedAddUserParameterOption =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		rowsUpdated: requestedAddUserParameterOption.RowsUpdated,
		valueId: requestedAddUserParameterOption.КодДобавленногоЗначения,
		lastModified: requestedAddUserParameterOption.LastModified,
	};
}

export function updateUserParameterAdapter(
	response: string,
): UpdateUserParameterResponse {
	const requestedUpdateUserParameter: RequestedUpdateUserParameter =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		rowsUpdated: requestedUpdateUserParameter.RowsUpdated,
		lastModified: requestedUpdateUserParameter.LastModified,
	};
}
