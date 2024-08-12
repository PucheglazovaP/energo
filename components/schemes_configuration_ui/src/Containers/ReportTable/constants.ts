import { endOfDay, startOfDay } from 'date-fns';

import { CalendarType } from '../../Shared/types';

/* Регулярное выражение для поля поиска, 
разрешающие вводить только четыре цифры */
export const searchInterfaceFieldPattern: string =
	'^(?:[<>](?:\\d{1,4})?|\\d{1,4})$';

// типы календаря в модальном окне CreateReport
export const usedTypes = [CalendarType.Day, CalendarType.Period];

// Начальный стейт для календаря (начало и конец сегодняшнего дня)
export const initialPeriodState = [
	startOfDay(new Date()),
	endOfDay(new Date()),
];
