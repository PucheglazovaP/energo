import { GroupListItem } from '../../Models/HardwareGroup/types';
import { GroupsInReportForm } from '../../Models/ReportFormProperties/types';

export function isGroupSelected(
	group: GroupsInReportForm,
	selectedGroups: GroupsInReportForm[],
) {
	return selectedGroups.some((item) => item.groupNumber === group.groupNumber);
}
export function isDeviceSelected(
	group: GroupListItem,
	selectedGroups: GroupListItem[],
) {
	return selectedGroups.some((item) => item.number === group.number);
}
export function getMethodColor(method: string) {
	switch (method) {
		case 'Сумма':
			return '#92bc8c';
		case 'Среднее':
			return '#F9A823';
		case 'Текущее':
			return '#C7A6CD';
	}
}
