import { PeriodList } from '../../Models/PeriodsForChartComparison/types';
import { CalendarType } from '../../Shared/types';

export type PeriodItemProps = {
	item: PeriodList;
	onDelete: (id: string) => void;
	onSelect: (period: Date[], id: string) => void;
	onTypeChange: (type: CalendarType, id: string) => void;
};
