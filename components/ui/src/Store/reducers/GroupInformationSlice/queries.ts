import { FormsParams, MnemoschemesParams } from './types';

export const getFormsQuery = (params: FormsParams) => {
	return {
		Sql: '[Редактор].[dbo].Get_СписокФормОбъектовДляГруппы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
				Direction: 'Input',
			},
			{
				Name: '@КодГруппы',
				DbType: 'int',
				Value: params.groupId,
				Direction: 'Input',
			},
		],
	};
};

export const getSystemsQuery = (groupId: number) => {
	return {
		Sql: '[Редактор].[dbo].Get_СписокСистемДляГруппы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодГруппы',
				DbType: 'int',
				Value: groupId,
				Direction: 'Input',
			},
		],
	};
};

export const getVersionsQuery = (groupId: number, systemId: number) => {
	return {
		Sql: '[Редактор].[dbo].Get_ВерсииДляГруппы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодСистемы',
				DbType: 'int',
				Value: systemId,
				Direction: 'Input',
			},
			{
				Name: '@КодГруппы',
				DbType: 'int',
				Value: groupId,
				Direction: 'Input',
			},
		],
	};
};

export const getMnemoschemesQuery = (params: MnemoschemesParams) => {
	return {
		Sql: '[Редактор].[dbo].Get_ДеревоФормУпорядоченоПоУровнямДляГруппы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
				Direction: 'Input',
			},
			{
				Name: '@СтартовыйУзел',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@КодГруппы',
				DbType: 'int',
				Value: params.groupId,
				Direction: 'Input',
			},
		],
	};
};
