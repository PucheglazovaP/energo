export interface AccountingNode {
	parameterId: number | null;
	dailyPointGroupsId: number | null;
	visualizationGroupName: string;
	name: string;
	shortName: string;
	sortOrder: number;
	comment: string;
	pointId: number | null;
	pointName: string;
	methodId: number;
	methodName: string;
	calculateMethodId: number;
	calcName: string;
	energyResourceId: number;
	precision: number | string;
	hourShift: number | string;
	activeFrom: Date;
	activeTo: Date;
	linkedDailyPointsId: number | null;
	linkedColumns: number;
	changeDT: Date;
	lastModified: string;
}

export type Method = {
	label: string;
	value: string | number;
	isSelected: boolean;
};
