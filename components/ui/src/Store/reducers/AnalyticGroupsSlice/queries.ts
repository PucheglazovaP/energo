import {
	AnalyticGroupsProps,
	CreateAnalyticGroupsProps,
	DeleteAnalyticGroupRange,
	UpdateAnalyticGroupRange,
} from './types';

export const getAnalyticGroupsQuery = ({
	userId,
	moduleName,
}: AnalyticGroupsProps) => {
	return {
		Sql: '[appl_tags].[Get_AnaliticAccountsGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
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
};
export const createNewAnalyticGroupQuery = ({
	userId,
	rangeStart,
	rangeEnd,
	analyticId,
	moduleName,
}: CreateAnalyticGroupsProps) => {
	return {
		Sql: '[appl_tags].[Ins_CreateNewAccountsGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@AccUID',
				DbType: 'String',
				Value: analyticId,
				Direction: 'Input',
			},
			{
				Name: '@ID_Group_Start',
				DbType: 'int',
				Value: rangeStart,
				Direction: 'Input',
			},
			{
				Name: '@ID_Group_End',
				DbType: 'int',
				Value: rangeEnd,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: '',
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
				Size: '4000',
			},
		],
	};
};
export const updateAnalyticGroupQuery = ({
	rangeId,
	rangeEnd,
	rangeStart,
	lastModified,
	analyticId,
	userId,
	moduleName,
}: UpdateAnalyticGroupRange) => {
	return {
		Sql: '[appl_tags].[Upd_AccountsGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@id',
				DbType: 'int',
				Value: rangeId,
				Direction: 'Input',
			},
			{
				Name: '@AccUID',
				DbType: 'String',
				Value: analyticId,
				Direction: 'Input',
			},
			{
				Name: '@id_group_start',
				DbType: 'int',
				Value: rangeStart,
				Direction: 'Input',
			},
			{
				Name: '@id_group_end',
				DbType: 'int',
				Value: rangeEnd,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: '',
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
				Size: '64',
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
				Size: '4000',
			},
		],
	};
};

export const deleteAnalyticGroupQuery = ({
	rangeId,
	lastModified,
	analyticId,
	userId,
	moduleName,
}: DeleteAnalyticGroupRange) => {
	return {
		Sql: '[appl_tags].[Del_AccountsGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@id',
				DbType: 'int',
				Value: rangeId,
				Direction: 'Input',
			},
			{
				Name: '@AccUID',
				DbType: 'String',
				Value: analyticId,
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
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
				Size: '64',
			},
		],
	};
};
