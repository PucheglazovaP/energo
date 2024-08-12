import { format } from 'date-fns';

import { ExcelRow, Trend } from '../Shared/types';
import { DateFormat } from '../Utils/dateUtils';

export default function tableDataExcelAdapter(
	trends: Trend[],
	coefficient: number,
) {
	const preparedData = trends.reduce<ExcelRow[]>((acc, trend, index) => {
		trend.data.forEach((dataItem) => {
			const formattedDate = format(
				new Date(dataItem.date),
				DateFormat.DefaultDisplayFormatWithSeconds,
			);
			const existingRow = acc.findIndex((row) => row.date === formattedDate);
			const value =
				dataItem.value != null ? Number(dataItem.value) * coefficient : '';

			if (existingRow >= 0) {
				acc[existingRow] = {
					...acc[existingRow],
					[`col-${index}`]: value,
				};
			} else {
				acc.push({
					[`col-${index}`]: value,
					date: formattedDate,
				});
			}
		});
		return acc;
	}, []);

	const columnsForExcel = createExcelHeaders(trends);
	return { preparedData, columnsForExcel };
}

export function createExcelHeaders(trends: Trend[]) {
	const newColumns = trends.map((trend, index) => ({
		key: `col-${index}`,
		header: trend.name,
		width: 35,
	}));
	return [{ header: 'Дата и время', key: 'date', width: 40 }, ...newColumns];
}
