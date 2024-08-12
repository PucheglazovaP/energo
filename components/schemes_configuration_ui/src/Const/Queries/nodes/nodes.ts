import {
	CreateNodeParams,
	DeleteNodeParams,
	EditNodeParams,
} from '../../../Shared/types';

import { NodesParams } from './types';

export function getNodesListQuery({
	deviceId,
	userId,
	moduleName,
}: NodesParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ListDeviceNodes]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_Device',
				DbType: 'int',
				Value: deviceId,
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

export function createNodeQuery({
	deviceId,
	nodeName,
	userId,
	moduleName,
}: CreateNodeParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Ins_СоздатьУзелУчета',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@НомерПрибора',
				DbType: 'int',
				Value: deviceId,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеУзла',
				DbType: 'String',
				Value: nodeName,
				Direction: 'Input',
			},
			{
				Name: '@ПроектныйНомерУзла',
				DbType: 'String',
				Value: null,
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

export function editNodeQuery({
	nodeId,
	nodeName,
	userId,
	lastModified,
	moduleName,
}: EditNodeParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Upd_ИзменитьУзелУчета',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодУзла',
				DbType: 'int',
				Value: nodeId,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеУзла',
				DbType: 'String',
				Value: nodeName,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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

export function deleteNodeQuery({
	nodeId,
	userId,
	moduleName,
}: DeleteNodeParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Del_УдалитьУзелУчетаНСИ',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодУзла',
				DbType: 'int',
				Value: nodeId,
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
