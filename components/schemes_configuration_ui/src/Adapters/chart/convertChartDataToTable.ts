import { format } from 'date-fns';

import { Trend } from '../../Shared/types';
import { ITableColumn } from '../../UI/Table/types';
import { calculateY } from '../../Utils/convertValue';
import { DateFormat } from '../../Utils/dateUtils';
import { filterTrends } from '../../Utils/trends';

export function tableDataAdapter(trends: Trend[], coefficient: number = 1) {
	const tableMap = new Map<
		string,
		{ [propName: string]: number | string; date: string }
	>(); // Используем Map для хранения данных
	const filteredTrends = filterTrends(trends);
	for (let index = 0; index < filteredTrends.length; index++) {
		const trend = filteredTrends[index];
		for (const dataItem of trend.data) {
			const formattedDate = format(
				new Date(dataItem.date),
				DateFormat.DefaultDisplayFormatWithSeconds,
			);
			let existingRow = tableMap.get(formattedDate);
			if (existingRow) {
				existingRow = {
					...existingRow,
					[`col${index}`]:
						dataItem.value != null
							? String(calculateY(dataItem.value, coefficient, trend.round))
							: 'Н/Д',
				};
			} else {
				existingRow = {
					date: formattedDate,
					[`col${index}`]:
						dataItem.value != null
							? String(calculateY(dataItem.value, coefficient, trend.round))
							: 'Н/Д',
				};
			}
			tableMap.set(formattedDate, existingRow);
		}
	}
	return Array.from(tableMap.values());
}

export function modifyHeaders(tableHeader: ITableColumn[], trends: Trend[]) {
	const newColumns = filterTrends(trends)
		.filter((trend) => trend.isVisibleOnChart)
		.map((trend, index) => ({
			accessor: `col${index}`,
			text: trend.name,
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'number',
			minWidth: 400,
		}));
	return [...tableHeader, ...newColumns];
}
