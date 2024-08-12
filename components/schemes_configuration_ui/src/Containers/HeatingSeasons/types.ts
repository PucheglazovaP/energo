import { HeatingSeason } from '../../Models/HeatingSeasons/types';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

export enum HeatingSeasonsAccessors {
	SeasonStartDate = 'seasonStartDate',
	SeasonEndDate = 'seasonEndDate',
	Info = 'info',
	Buttons = 'buttons',
	Status = 'status',
}

export type HeatingSeasonInfoItemProps = Omit<
	HeatingSeason,
	'seasonStartDate' | 'seasonEndDate' | 'seasonCode' | 'status'
>;
export type HeatingSeasonsHeaderProps = {
	onGetHeatingSeasons: () => void;
};
export type HeatingSeasonsBodyProps = {
	tableHeader: ITableColumn[];
	tableBody: ITableBody[];
	onHeatingSeasonAdd: () => void;
};

export type HeatingSeasonButtonsProps = {
	onHeatingSeasonUpdate: () => void;
	onHeatingSeasonDelete: () => void;
};

export enum HeatingSeasonMode {
	Edit,
	Add,
}

export type HeatingSeasonModalBodyProps = {
	modalMode: HeatingSeasonMode;
};
