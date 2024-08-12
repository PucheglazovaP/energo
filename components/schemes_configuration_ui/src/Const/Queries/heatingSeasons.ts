import {
	HeatingSeasonAction,
	HeatingSeasonOperation,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getHeatingSeasonsQuery() {
	return {
		Sql: '[Energy].[energy].[Get_ОтопительныеСезоны]',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}

export function heatingSeasonActionQuery({
	seasonEndDate = null,
	seasonStartDate = null,
	userId,
	seasonId = null,
	operation = HeatingSeasonOperation.Update,
	moduleName = ModuleName.Test,
}: HeatingSeasonAction) {
	return {
		Sql: '[Energy].[energy].[InsUpdDel_ОтопительныеСезоныСЛогом]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Id',
				DbType: 'int',
				Value: seasonId,
				Direction: 'Input',
			},
			{
				Name: '@DateStart',
				DbType: 'DateTime',
				Value: seasonStartDate,
				Direction: 'Input',
			},
			{
				Name: '@DateFinish',
				DbType: 'DateTime',
				Value: seasonEndDate,
				Direction: 'Input',
			},
			{
				Name: 'Oper',
				DbType: 'int',
				Value: operation,
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
