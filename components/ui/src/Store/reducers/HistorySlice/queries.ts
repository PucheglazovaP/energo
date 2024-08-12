import { getOutputParameters } from '../../../Const/utils';

import { HistoryElementParams, HistoryGeneralParams } from './types';

export const getGeneralHistoryQuery = ({
	fromDate,
	toDate,
	isGroup,
	isChannel,
	isDevice,
	pageRowCount,
	pageNumber,
	userId,
}: HistoryGeneralParams) => {
	return {
		Sql: '[appl_tags].[Get_History]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FromDate',
				DbType: 'string',
				Value: fromDate,
				Direction: 'Input',
			},
			{
				Name: '@ToDate',
				DbType: 'string',
				Value: toDate,
				Direction: 'Input',
			},
			{
				Name: '@AddHour',
				DbType: 'int',
				Value: -5,
				Direction: 'Input',
			},
			{
				Name: '@GetGroups',
				DbType: 'int',
				Value: isGroup,
				Direction: 'Input',
			},
			{
				Name: '@GetChannels',
				DbType: 'int',
				Value: isChannel,
				Direction: 'Input',
			},
			{
				Name: '@GetDevices',
				DbType: 'int',
				Value: isDevice,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'string',
				Value: userId,
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
			...getOutputParameters('err', 'textErr', 'pageTotalCount'),
		],
	};
};

export const getElementHistoryQuery = (params: HistoryElementParams) => {
	const { path, fromDate, toDate, id, userId } = params;
	return {
		Sql: path,
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@FromDate',
				DbType: 'string',
				Value: fromDate,
				Direction: 'Input',
			},
			{
				Name: '@ToDate',
				DbType: 'string',
				Value: toDate,
				Direction: 'Input',
			},
			{
				name: '@AddHour',
				DbType: 'int',
				Value: -5,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'string',
				Value: userId,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr'),
		],
	};
};
