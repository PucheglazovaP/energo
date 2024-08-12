import { format } from 'date-fns';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

interface Column {
	key: string;
	header: string;
}

function exportInfoTableToExcel(
	columns: Column[],
	data: any[],
	fileName: string,
) {
	const wb = new Workbook();
	const ws = wb.addWorksheet(fileName.replace(/[\\*\\?\\:\\\\/\\[\]]/g, ''));
	ws.columns = [...columns];
	ws.addRows(data);
	// eslint-disable-next-line no-plusplus

	ws.getRow(1).alignment = {
		vertical: 'middle',
		horizontal: 'center',
		wrapText: true,
	};
	const resultFileName = `${fileName} ${format(
		new Date(),
		'yyyy-MM-dd HH-mm-ss',
	)}.xlsx`;
	wb.xlsx.writeBuffer().then((buffer) => {
		saveAs(
			new Blob([buffer], { type: 'application/octet-stream' }),
			resultFileName,
		);
	});
}
/**
 * Подготавливает табличные данные для буфера обмена в формате экселя
 */
export function createTextContentForClipboard(
	columns: Column[],
	data: any[],
	fileName: string,
) {
	const wb = new Workbook();
	const ws = wb.addWorksheet(fileName.replace(/[\\*\\?\\:\\\\/\\[\]]/g, ''));
	ws.columns = [...columns];
	ws.addRows(data);

	ws.getRow(1).alignment = {
		vertical: 'middle',
		horizontal: 'center',
		wrapText: true,
	};
	const worksheet = wb.getWorksheet(1);
	let textToCopy = '';
	worksheet.eachRow((row) => {
		const values = row.values as string[];
		if (values != null)
			textToCopy +=
				values
					.filter((item) => item != null)
					.map((item) => {
						return item.toString();
					})
					.join('\t') + '\n'; // Создаем строку для копирования, используя табуляцию как разделитель
	});
	return textToCopy;
}

export default exportInfoTableToExcel;
