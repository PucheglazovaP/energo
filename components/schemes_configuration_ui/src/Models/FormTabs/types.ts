import { FormTypes, Trend } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { OptionWithCoefficient } from '../ActiveChart/types';

export type FormTab = {
	title: string;
	formId?: number;
	tabId: string;
	formType?: FormTypes;
	isSelected: boolean;
	navigationHistory: string[];
	formSettings: Partial<FormSettings>;
	url: string;
};
export type FormSettings = {
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	isUpdateEnabled: boolean;
	updateDelay: number;
	unitList: OptionWithCoefficient[];
	discreteList: SelectOption[];
	isMultiYaxesEnabled: boolean;
	isTimeWithoutDataEnabled: boolean;
	isRelativeZeroEnabled: boolean;
	isArchiveModeEnabled: boolean;
	chartData: Trend[];
};
export type ChangeTab = {
	tabId: string;
	versionCode: number;
	userId: string;
};
