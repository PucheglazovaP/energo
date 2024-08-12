import {
	FilterOptions,
	SortOptions,
	TransparentEmergencyEventsStatusList,
} from '../../Shared/types';

export type TransparentEmergencyEventsInfo = {
	metricId: number | null;
	eventsInfo: TransparentEmergencyEventsStatusList[];
	isGroupChartModalOpen: boolean;
	eventStatusType: FilterOptions[];
	kvitPersons: FilterOptions[];
	selectedEventStatusType: number[];
	selectedKvitPersons: string[];
	sortFilter: SortOptions;
};
