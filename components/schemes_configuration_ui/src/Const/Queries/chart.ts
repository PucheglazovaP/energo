import { format } from 'date-fns';

import {
	CreateSeriesParams,
	FetchChartDataParams,
	FetchChartKoefParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getChartCurrentKoef({ gr, userId }: FetchChartKoefParams) {
	return {
		Sql: '[appl_tags].[Get_Group]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: gr,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};
}
export function getChartDataQuery({
	gr,
	startDateTime,
	endDateTime,
	isMoscowTimeZone,
	discrete,
	round = 10,
	gtype = 0,
	moduleName = ModuleName.Test,
	multipleCount = 0,
}: FetchChartDataParams) {
	return {
		Sql: '[Energy].[energy].[Get_АРМ_ДанныеДляГрафикаПоГруппе]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@from_dat',
				DbType: 'String',
				Value: format(startDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@to_dat',
				DbType: 'String',
				Value: format(endDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@gr',
				DbType: 'int',
				Value: gr,
				Direction: 'Input',
			},
			{
				Name: '@typ',
				DbType: 'String',
				Value: discrete,
				Direction: 'Input',
			},
			{
				Name: '@multipleCount',
				DbType: 'int',
				Value: multipleCount,
				Direction: 'Input',
			},
			{
				Name: '@round',
				DbType: 'int',
				Value: round,
				Direction: 'Input',
			},
			{
				Name: '@gtype',
				DbType: 'int',
				Value: gtype,
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
				Name: '@HOURShift_in',
				DbType: 'int',
				Value: isMoscowTimeZone ? 2 : 0,
				Direction: 'Input',
			},
		],
	};
}

export function createSeriesQuery({ formId, versionId }: CreateSeriesParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьНовуюСерию',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionId,
				Direction: 'Input',
			},
		],
	};
}
