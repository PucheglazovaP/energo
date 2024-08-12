import { Trend } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { ITableColumn } from '../../UI/Table/types';
import { OptionWithCoefficient } from '../ActiveChart/types';

export type Widget = {
	versionCode: number;
	formId?: number;
	title: string;
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	isUpdateEnabled: boolean;
	updateDelay: number;
	unitList: OptionWithCoefficient[];
	discreteList: SelectOption[];
	isTimeWithoutDataEnabled: boolean;
	isRelativeZeroEnabled: boolean;
	isArchiveModeEnabled: boolean;
	isMultiYaxesEnabled: boolean;
	chartData: Trend[];
	tableHeader: ITableColumn[];
	isWidgetOpen: boolean;
};
