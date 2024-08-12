import {
	AcknowledgementStatusFilter,
	SwitcherItemType,
} from '../../Shared/types';

export const statusSwitcherItems: SwitcherItemType[] = [
	{
		id: AcknowledgementStatusFilter.All,
		title: 'Все',
	},
	{
		id: AcknowledgementStatusFilter.Acknowledged,
		title: 'Квитированные',
	},
	{
		id: AcknowledgementStatusFilter.NotAcknowledged,
		title: 'Не квитированные',
	},
];
