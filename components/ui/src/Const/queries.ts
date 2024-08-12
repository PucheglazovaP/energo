import { OutputParameters } from './types';

export const OUTPUT_PARAMETERS: OutputParameters = {
	err: {
		Name: '@Err',
		DbType: 'int',
		Value: null,
		Direction: 'Output',
		Size: 64,
	},
	textErr: {
		Name: '@TextErr',
		DbType: 'String',
		Value: null,
		Direction: 'Output',
		Size: 2000,
	},
	textWarn: {
		Name: '@TextWarn',
		DbType: 'string',
		Value: null,
		Direction: 'Output',
		Size: 2000,
	},
	pageTotalCount: {
		Name: '@PageTotalCount',
		DbType: 'int',
		Value: null,
		Direction: 'Output',
		Size: 64,
	},
	logOperation: {
		Name: '@LogOperation',
		DbType: 'String',
		Value: null,
		Direction: 'Output',
		Size: 4000,
	},
};
