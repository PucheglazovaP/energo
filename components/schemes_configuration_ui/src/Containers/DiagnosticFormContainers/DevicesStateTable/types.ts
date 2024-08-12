import {
	ExpressionFieldName,
	FilterItem,
	StorageFieldName,
} from '../../../Models/DiagnosticCurrent/types';
import { Cell } from '../../../UI/Table/types';

export enum DiagnosticCurrentTableColumn {
	Interface = 'interface',
	PortLine = 'portLine',
	Status = 'status',
	Type = 'type',
	NetworkNumber = 'networkNumber',
	Number = 'number',
	Name = 'name',
	Ok = 'ok',
	Crc = 'crc',
	To = 'to',
	IcpTo = 'icpTo',
	Date = 'date',
	WithoutConnection = 'withoutConnection',
	Favorite = 'favorite',
}

export type DevicesStateTableHighlightCellProps = {
	data: Cell & { backgroundColor?: string };
};

export type DevicesStateTableDefaultSectionProps = {
	title: string;
};

export type DevicesStateTableFilterHeaderProps = {
	title: string;
	filterItems: FilterItem[];
	filterStorage: Record<string, boolean>;
	storageFieldName: StorageFieldName;
	onApply: () => void;
	isSearchBoxVisible?: boolean;
	isSelectAllVisible?: boolean;
	isItemsListVisible?: boolean;
};

export type DevicesStateTableFilterHeaderNumberProps = {
	title: string;
	expressionFieldName: ExpressionFieldName;
	onApply: () => void;
};

export type DevicesStateTableFavoriteButtonCellProps = {
	data: Cell & { deviceId?: string };
};
export type DevicesStateTableRadioButtonCellProps = {
	data: Cell & { deviceId?: string };
};

export default {};
