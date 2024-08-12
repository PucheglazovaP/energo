import { getOutputParameters } from '../../../Const/utils';

import { VacantEntityParams } from './types';

export const getVacantEntitiesQuery = (params: VacantEntityParams) => {
	const { userId, pageNumber, pageRowCount, vacantEntityType } = params;
	return {
		Sql: vacantEntityType,
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number_From',
				DbType: 'int',
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@Number_To',
				DbType: 'int',
				Value: 1000000,
				Direction: 'Input',
			},
			{
				Name: '@PageRowCount',
				DbType: 'int',
				Value: pageRowCount,
				Direction: 'Input',
			},
			{
				Name: '@PageNumber',
				DbType: 'int',
				Value: pageNumber,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr', 'pageTotalCount'),
		],
	};
};
