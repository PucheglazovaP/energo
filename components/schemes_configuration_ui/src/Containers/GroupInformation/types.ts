import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { Trend } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

export enum GroupInformationTableColumn {
	Name = 'name',
	Number = 'number',
	Value = 'value',
	Formula = 'formula',
	UnitName = 'unitName',
	Ki = 'ki',
	Ku = 'ku',
	ChOb = 'chOb',
}
export interface GroupFormulaModalProps {
	groupId: number | null;
	groupName: string;
	onClose: () => void;
	isOpen: boolean;
}
export interface ChartState {
	discreteList: SelectOption[];
	isLoading: boolean;
	data: Trend[];
	unitList: OptionWithCoefficient[];
}
export type ChartActions =
	| { type: 'UPDATE_LIST'; payload: SelectOption[] }
	| { type: 'UPDATE_UNIT_LIST'; payload: OptionWithCoefficient[] }
	| { type: 'SET_FLAG'; flagName: string }
	| { type: 'UPDATE_CHART_DATA'; payload: Trend[] };

export enum ChartActionsType {
	UpdateList = 'UPDATE_LIST',
	UpdateUnitList = 'UPDATE_UNIT_LIST',
	SetFlag = 'SET_FLAG',
	UpdateChartData = 'UPDATE_CHART_DATA',
}
export default interface ChartSectionProps {
	className?: string;
}
