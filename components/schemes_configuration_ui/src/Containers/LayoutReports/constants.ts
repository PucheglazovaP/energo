import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import { Path } from '../../Shared/types';

export const REPORTS_UGE: SwitcherItemType[] = [
	{
		id: Path.ReportByPoints,
		title: 'Базовые точки учета',
	},
	{
		id: Path.ReportByParameters,
		title: 'Параметры приборных и вычисляемых величин',
	},
	{
		id: Path.ReferenceByReports,
		title: 'Справочник отчетов за период',
	},
	{
		id: Path.ReferenceByForms,
		title: 'Справочник печатных форм',
	},
];
