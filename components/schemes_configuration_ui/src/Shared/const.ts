import { FormTypes } from './types';

export const FORM_TYPES = [
	{
		name: FormTypes.Form,
		id: 1,
		codeType: 681,
	},
	{
		name: FormTypes.Chart,
		id: 2,
		codeType: 682,
	},
	{
		name: FormTypes.MultiChart,
		id: 9,
		codeType: 738,
	},
	{
		name: FormTypes.ReportForm,
		id: 8,
		//codeType (нигде не используется в приложении)
		codeType: 0,
	},
	{
		name: FormTypes.DiagnosticForm,
		id: 6,
	},
	{
		name: FormTypes.CondensateDrainForm,
		id: 16,
	},
	{
		name: FormTypes.ActivePowerForm,
		id: 7,
	},
];

/* @typ это 'C', 'HH', 'H', 'D', 'M' */
/* C - минутные */
/* HH - получасовые */
/* H - часовые */
/* D - суточные */
/* M - месяц */

export const YAXIS_LINE_COLORS = [
	'#9B9B9C',
	'#FAB82E',
	'#6EA566',
	'#B5457C',
	'#F39646',
	'#CCCCCC',
	'#FDD58B',
	'#92BC8C',
	'#C7A6CD',
	'#F8B176',
	'#EB5835',
];

export const LONG_AUTO_CLOSE = 10000;

export const NEED_TO_SKIP_AUTH = import.meta.env
	.VITE_DISABLED_AUTH_ON_LOCAL_POINT;

export const LOCAL_USER = {
	id: '52cac67e-0250-4417-a0bb-1b18313e8b15',
	lastName: 'Akhtyamov',
	firstName: 'Maksim',
	email: 'maksim.akhtyamov@evraz.com',
	preferredUsername: 'rusinova_nn',
};

export const MAX_DATE = new Date('9999-12-31');
