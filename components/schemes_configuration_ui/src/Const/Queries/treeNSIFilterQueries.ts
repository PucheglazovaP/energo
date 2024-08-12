import { AvailableFiltersNSIParams } from '../../Shared/types';

export function getAvailableFiltersNSIQuery({
	userId,
	moduleName,
}: AvailableFiltersNSIParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ListObjectsFilterValues]',
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
}
