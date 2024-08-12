import { UserId } from '../../../Shared/types';
import { Module } from '../../../Shared/Types/moduleName';

export interface UserParametersListParams extends UserId, Module {
	unitId: string;
	unitTypeId: number;

	parameterId?: number;
}

export interface GetUserParameterOptionsParams extends UserId, Module {
	parameterId: number;
}

export interface GetUserParameterFilesListParams extends UserId, Module {
	valueId: number;
}

export interface GetUserParameterFileParams extends UserId, Module {
	fileId: number;
}

export interface GetUserParameterFileResponse {
	content: string;
}

export interface SetAllObjectsValueParams
	extends GetUserParameterOptionsParams {
	currentValueId: number;
	futureValueId: number;
}

export interface SetAllObjectsValueResponse {
	rowsUpdated: number;
}

export interface SaveUserParameterValueParams
	extends Pick<UserParametersListParams, 'unitId' | 'userId' | 'moduleName'> {
	parameterId: number;
	valueId: number | null;
	value: string;
	fileId: number | null;
	fileBinaryData: string | null;
	fileName: string | null;
	valueLastModified: string | null;
}

export interface SaveUserParameterValueResponse {
	rowsUpdated: number;
	valueId: number;
	lastModified: string;
	fileId: number | null;
}

export interface GetUserParameterDataTypesParams extends UserId, Module {}

export interface AddUserParameterParams extends UserId, Module {
	unitTypeId: number;
	name: string;
	dataTypeId: number;
	comment: string;
}

export interface AddUserParameterResponse {
	rowsUpdated: number;
	parameterId: number;
	lastModified: string;
}

export interface AddUserParameterOptionParams extends UserId, Module {
	parameterId: number;
	value: string;
}

export interface AddUserParameterOptionResponse {
	rowsUpdated: number;
	valueId: number;
	lastModified: string;
}

export interface UpdateUserParameterParams extends UserId, Module {
	parameterId: number;
	name: string;
	comment: string;
	lastModified: string;
}

export interface UpdateUserParameterResponse {
	rowsUpdated: number;
	lastModified: string;
}

export interface UpdateUserParameterOptionParams extends UserId, Module {
	valueId: number;
	value: string;
	lastModified: string;
}

export interface DeleteUserParameterParams extends UserId, Module {
	parameterId: number;
	lastModified: string;
}

export interface DeleteUserParameterOptionParams extends UserId, Module {
	valueId: number;
	lastModified: string;
}
