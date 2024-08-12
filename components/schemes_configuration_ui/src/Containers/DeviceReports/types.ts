import { DeviceReportsTypes } from '../../Models/DeviceReports/types';
import { DeviceParams } from '../../Shared/types';

export enum DevicesReportTitle {
	DevicesStatements = 'Показания приборов',
	EmergencyLog = 'Журнал нештатных ситуаций',
	FailuresLog = 'Журнал отказов',
}

export interface DevicesHeaderButtonsProps {
	onDeviceEdit: () => void;
	onGenerateReport: () => void;
}
export interface DeviceParameterEdit {
	onEditDeviceParameter: ({ name, value }: DeviceParams) => void;
}
export interface DeviceParametersProps extends DeviceParameterEdit {
	deviceParameters: DeviceParams[];
}

export interface DeviceParameterProps extends DeviceParameterEdit {
	deviceParameter: DeviceParams;
}

export interface DeviceReportsHeaderProps extends DevicesHeaderButtonsProps {
	reportTypes: DeviceReportsTypes[];
	onChangeType: (id: string) => void;
}
