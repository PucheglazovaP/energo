export type ReportItem = {
	id: number;
	reportId: number;
	parentId: number | null;
	sortOrder: number;
	reportPositionNumber: string;
	positionName: string;
	isCalculated: number | null;
	pointId: number | null;
	coefficient: number;
	activeFrom: string | null;
	activeTo: string | null;
	changeDateTime: string;
	level: number;
	pointName: string;
	isOpen: boolean;
};

export enum EditTextName {
	PositionName = 'positionName',
	Coefficient = 'coefficient',
}
