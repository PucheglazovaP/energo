import {
	ChangeFormObjectLayerParams,
	CreateFormLayerParams,
	CreateSystemLayerParams,
	DeleteFormLayerParams,
	DeleteSystemLayerParams,
	GetFormLayersParams,
	GetSystemLayerFormsParams,
	ReplaceFormLayerParams,
	SystemLayersInfoParams,
	UpdateSystemLayerParams,
} from '../../Shared/types';

export function getSystemLayers(params: SystemLayersInfoParams) {
	const { systemCode, userId, moduleName } = params;
	return {
		Sql: '[Редактор].[dbo].Get_СлоиСистемы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодСистемы',
				DbType: 'int',
				Value: systemCode,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function createSystemLayer(params: CreateSystemLayerParams) {
	const { systemCode, userId, moduleName, layerName, comment } = params;
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьСлой',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодСистемы',
				DbType: 'int',
				Value: systemCode,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: layerName,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function updateSystemLayer(params: UpdateSystemLayerParams) {
	const { layerId, userId, moduleName, layerName, comment, lastModified } =
		params;
	return {
		Sql: '[Редактор].[dbo].Upd_ИзменитьСлой',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Код',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: layerName,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function deleteSystemLayer(params: DeleteSystemLayerParams) {
	const { layerId, userId, moduleName, lastModified } = params;
	return {
		Sql: '[Редактор].[dbo].Del_УдалитьСлой',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Код',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function changeFormObjectLayer(params: ChangeFormObjectLayerParams) {
	const { objectId, userId, layerId, moduleName } = params;
	return {
		Sql: '[Редактор].[dbo].Upd_ИзменитьСлойОбъекта',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъекта',
				DbType: 'int',
				Value: objectId,
				Direction: 'Input',
			},
			{
				Name: '@Layer',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function getFormLayers(params: GetFormLayersParams) {
	const { formId, userId, moduleName } = params;
	return {
		Sql: '[Редактор].[dbo].Get_СлоиФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function createFormLayer(params: CreateFormLayerParams) {
	const { formId, layerId, parentLayerId, moduleName, userId } = params;
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьСлойФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@КодСлояСистемы',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@КодРодительскогоСлоя',
				DbType: 'int',
				Value: parentLayerId || null,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function replaceFormLayer(params: ReplaceFormLayerParams) {
	const {
		lastModified,
		layerId,
		parentLayerId,
		moduleName,
		userId,
		prevLayerId = 0,
	} = params;
	return {
		Sql: '[Редактор].[dbo].Upd_ПеренестиСлойФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Код',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@КодРодительскогоСлоя',
				DbType: 'int',
				Value: parentLayerId,
				Direction: 'Input',
			},
			{
				Name: '@PrevID',
				DbType: 'int',
				Value: prevLayerId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function deleteFormLayer(params: DeleteFormLayerParams) {
	const { lastModified, layerId, moduleName, userId } = params;
	return {
		Sql: '[Редактор].[dbo].Del_УдалитьСлойФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Код',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function getSystemLayerForms(params: GetSystemLayerFormsParams) {
	const { layerId, moduleName, userId } = params;
	return {
		Sql: '[Редактор].[dbo].Get_ФормыСлояСистемы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодСлоя',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
