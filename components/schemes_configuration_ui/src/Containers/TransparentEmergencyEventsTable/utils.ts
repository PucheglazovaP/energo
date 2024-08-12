import {
	FilterOptions,
	TransparentEmergencyEventsStatusList,
} from '../../Shared/types';

import { statusesLabels } from './const';

export function getFilterOptionsByEventStatusType(
	eventsInfo: TransparentEmergencyEventsStatusList[],
): FilterOptions[] {
	const filterOptions: FilterOptions[] = [];

	const typesList: number[] = eventsInfo.map(
		({ eventCodeType }) => eventCodeType,
	);

	new Set(typesList).forEach((eventCodeType: number) => {
		const eventTypeName = statusesLabels.get(eventCodeType)?.label;
		filterOptions.push({
			name: eventTypeName || '',
			key: String(eventCodeType),
			isChecked: true,
		});
	});

	return filterOptions;
}
export function getFilterOptionsByKvitPersons(
	eventsInfo: TransparentEmergencyEventsStatusList[],
): FilterOptions[] {
	const filterOptions: FilterOptions[] = [];

	const typesList: string[] = eventsInfo
		.filter(({ kvitPerson }) => kvitPerson)
		.map((item) => item.kvitPerson || '');

	new Set(typesList).forEach((kvitPerson: string) => {
		filterOptions.push({
			name: kvitPerson,
			key: String(kvitPerson),
			isChecked: true,
		});
	});

	return filterOptions;
}
