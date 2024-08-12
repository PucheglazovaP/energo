import { Permissions } from './types';

// Базовые права для основных ролей

export const administratorPermissions: Permissions[] = [
	Permissions.CanAccessMonitoring,
	Permissions.CanAccessNsi,
	Permissions.CanAccessOperWork,
	Permissions.CanSeeDeviceReports,
	Permissions.CanCreateNewForm,
	Permissions.CanCopyForm,
	Permissions.CanDeleteForm,
	Permissions.CanEditForm,
	Permissions.CanMoveForm,
	Permissions.CanPasteForm,
	Permissions.CanPublishForm,
	Permissions.CanViewDevicesArchive,
	Permissions.CanSeeFormContextMenu,
	Permissions.CanViewEmergencyEvents,
	Permissions.CanEditEmergencyEvents,
	Permissions.CanAccessDevicesStatus,
	Permissions.CanAccessRetrofittingAccountingNodes,
	Permissions.CanAccessStatisticalProcessing,
	Permissions.CanAccessElectricPower,
	Permissions.CanAccessNaturalGas,
	Permissions.CanAccessNSIPage,
	Permissions.CanEditNSIPage,
];

export const operInformPermissions: Permissions[] = [
	Permissions.CanAccessElectricPower,
	Permissions.CanAccessNaturalGas,
];

export const analyticPermissions: Permissions[] = [
	Permissions.CanAccessMonitoring,
	Permissions.CanCreateNewForm,
	Permissions.CanCopyForm,
	Permissions.CanDeleteForm,
	Permissions.CanEditForm,
	Permissions.CanPasteForm,
	Permissions.CanViewDevicesArchive,
	Permissions.CanSeeFormContextMenu,
	Permissions.CanViewEmergencyEvents,
];

export const viewerPermissions: Permissions[] = [
	Permissions.CanAccessMonitoring,
	Permissions.CanViewEmergencyEvents,
];

// Права на определенный функционал для пользователей
export const reportArchivePermissions: Permissions[] = [
	Permissions.CanSeeDeviceReports,
	Permissions.CanViewDevicesArchive,
];

export const reportUgeEditPermissions: Permissions[] = [
	Permissions.CanAccessNsi,
];

export const reportUgeOperPermissions: Permissions[] = [
	Permissions.CanAccessOperWork,
];

export const emergencyEventsViewPermissions: Permissions[] = [
	Permissions.CanViewEmergencyEvents,
];

export const emergencyEventsEditPermissions: Permissions[] = [
	Permissions.CanViewEmergencyEvents,
	Permissions.CanEditEmergencyEvents,
];

export const balancePermissions: Permissions[] = [
	Permissions.CanAccessDevicesStatus,
	Permissions.CanAccessRetrofittingAccountingNodes,
	Permissions.CanAccessStatisticalProcessing,
];
export const pageNSIViewPermissions: Permissions[] = [
	Permissions.CanAccessNSIPage,
];
export const pageNSIEditPermissions: Permissions[] = [
	Permissions.CanEditNSIPage,
	Permissions.CanAccessNSIPage,
];
