import { NSISelectedUnit } from '../../Models/NSISelectedUnit/types';

export const enum NSIParameterType {
	FILE = 'Файл',
	BOOLEAN = 'Да / Нет',
	DATE = 'Дата',
	TEXT = 'Текст',
	LIST = 'Список',
}

export interface NSIUserParametersProps {
	unit: NSISelectedUnit;
}
