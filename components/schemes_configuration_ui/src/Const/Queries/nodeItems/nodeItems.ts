import {
	LinkEquipmentPieceParams,
	UpdateChannelNodeParams,
	UpdateEquipmentPieceNodeParams,
} from '../../../Shared/types';

import { NodeItemsParams } from './types';

export function getNodeItemsListQuery({
	nodeId,
	userId,
	moduleName,
}: NodeItemsParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ListDeviceNodeItems]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_Node',
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

export function updateChannelNodeQuery({
	newNodeId,
	linkId,
	linkLastModified,
	userId,
	moduleName,
}: UpdateChannelNodeParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Upd_ИзменитьПривязкуКанала',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодТекущейСвязи',
				DbType: 'Int',
				Value: linkId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзлаУчета',
				DbType: 'Int',
				Value: newNodeId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: linkLastModified,
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

export function updateEquipmentPieceNodeQuery({
	newNodeId,
	newChannelId,
	linkId,
	linkLastModified,
	userId,
	moduleName,
}: UpdateEquipmentPieceNodeParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Upd_ИзменитьПривязкуЕдиницыОборудования',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодТекущейСвязи',
				DbType: 'Int',
				Value: linkId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзлаУчета',
				DbType: 'Int',
				Value: newNodeId,
				Direction: 'Input',
			},
			{
				Name: '@НомерКанала',
				DbType: 'Int',
				Value: newChannelId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: linkLastModified,
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

export function linkEquipmentPieceToNodeQuery({
	newNodeId,
	newChannelId,
	equipmentId,
	userId,
	moduleName,
}: LinkEquipmentPieceParams) {
	return {
		Sql: 'NSI.NSIConfiguration.Ins_ПривязатьЕдиницуОборудования',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодУзлаУчета',
				DbType: 'Int',
				Value: newNodeId,
				Direction: 'Input',
			},
			{
				Name: '@НомерКанала',
				DbType: 'Int',
				Value: newChannelId,
				Direction: 'Input',
			},
			{
				Name: '@EQUNR',
				DbType: 'String',
				Value: equipmentId,
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
