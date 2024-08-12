import {
	FilterOptions,
	SearchFilters,
	SortOptions,
	SortOrder,
} from '../Shared/types';
import { Cell, ITableBody } from '../UI/Table/types';

/**
 * Repeatedly returns sort order
 * @param {SortOrder} order - current order
 * @returns {SortOrder} sort order
 */
export function getSortOrder(order: SortOrder): SortOrder {
	const orders = [SortOrder.Asc, SortOrder.Desc, SortOrder.None];
	const orderIdx = orders.indexOf(order);
	if (orders[orderIdx + 1] !== undefined) {
		return orders[orderIdx + 1];
	}
	return orders[0];
}

export function sortByOrder(
	data: ITableBody[],
	accessor: string,
	order: SortOrder,
): ITableBody[] {
	const compareFn = compareByColumn(accessor, order);
	const result: ITableBody[] = [...data];
	result.sort(compareFn);
	return result;
}

/* Логика для кнопки сортировки в заголовках таблицы */
export function compareByColumn(
	column: string,
	order: number,
): (a: ITableBody, b: ITableBody) => number {
	return function compareFunction(a: ITableBody, b: ITableBody): number {
		if (order === 0) {
			return 0;
		}

		function getCoincidencesByAccessor(item: Cell): boolean {
			return item.accessor === column;
		}
		const [{ text: textA }]: Cell[] = a.dataLine.filter(
			getCoincidencesByAccessor,
		);
		const [{ text: textB }]: Cell[] = b.dataLine.filter(
			getCoincidencesByAccessor,
		);

		/* Если оба значения - числа, то вызываем функцию сравнения для чисел */
		if (!isNaN(Number(textA)) && !isNaN(Number(textB))) {
			return compareDigitByOrder(Number(textA), Number(textB), order);
		}

		/* Если оба значения - даты, то вызываем функцию сравнения для дат */
		if (
			!isNaN(Date.parse(String(textA))) &&
			!isNaN(Date.parse(String(textB)))
		) {
			return compareDatesByOrder(String(textA), String(textB), order);
		}

		/* Если оба значения - строки, то вызываем функцию сравнения для строк */
		return compareStringByOrder(String(textA), String(textB), order);
	};
}

/**
 *
 * @returns only cells that fit accessor
 */
function filterByAccessor(cells: Cell[], accessor: string): Cell[] {
	const result: Cell[] = cells.filter((cell) => cell.accessor === accessor);
	return result;
}

/**
 * Function to filter row cells by some text
 * @returns only cells that includes text
 */
function filterByText(cells: Cell[], text: string): Cell[] {
	const result: Cell[] = cells.filter((cell) =>
		/* делаем поиск в том числе регистронезависимым */
		String(cell.text).toLowerCase().includes(text.toLowerCase()),
	);
	return result;
}

/**
 * Util function to filter table rows by cell accessor and it's included text
 */
export function filterTableData(
	rows: ITableBody[],
	accessor: string,
	text: string,
): ITableBody[] {
	const result: ITableBody[] = rows.filter((row) => {
		const filteredByAccessor = filterByAccessor(row.dataLine, accessor);
		const filteredByText = filterByText(filteredByAccessor, text);
		return filteredByText.length;
	});
	return result;
}

/* Функция сортировки по строкам.
Также учитывается "направление" сортировки */
export function compareStringByOrder(
	a: string,
	b: string,
	orderDirection = 1,
): number {
	return b.localeCompare(a) * orderDirection;
}

/* Функция сортировки по числам.
Также учитывается "направление" сортировки */
export function compareDigitByOrder(
	a: number,
	b: number,
	orderDirection = 1,
): number {
	return (b - a) * orderDirection;
}

/* Функция сортировки по датам.
Строки с датой приводятся к количеству миллисекунд. 
Также учитывается "направление" сортировки */
export function compareDatesByOrder(
	a: string,
	b: string,
	orderDirection = 1,
): number {
	return (Date.parse(b) - Date.parse(a)) * orderDirection;
}

/* Тестирует строку на совпадение с регулярным выражением */
export function isMatchRegExp(string: string, regExpPattern: string): boolean {
	const regEx = new RegExp(regExpPattern);
	return regEx.test(string);
}

/**
 * Проверяем, есть ли в поисковых фильтрах непустые строки
 * @returns буль, показывающий есть ли в поисковых фильтрах непустые строки
 */
function isSearchFiltersEmpty(searchFilters: SearchFilters) {
	const values = Object.values(searchFilters).filter(
		(item: SearchFilters | string) => item !== '',
	);

	return values.length === 0;
}

/**
 * Фильтрация данных по значениям в поисковых полях
 * @returns отфильтрованный массив данных, если поисковые поля в шапке таблицы не пустые
 */
export function filterTableBodyBySearchFilters(
	array: ITableBody[],
	searchFilters: SearchFilters,
): ITableBody[] {
	let filteredArray: ITableBody[] = [];

	Object.entries(searchFilters).forEach(([accessor, value]) => {
		if (value === '') return;

		if (filteredArray.length > 0) {
			filteredArray = filterTableData(filteredArray, accessor, value);
		} else {
			filteredArray = filterTableData(array, accessor, value);
		}
	});

	return filteredArray.length === 0 && isSearchFiltersEmpty(searchFilters)
		? array
		: filteredArray;
}

/**
 * Изменяем выбранные опции в фильтре колонки таблицы
 * @returns набор измененных опций для фильтра колонки таблицы
 */
export function changeFilterOptions(
	key: string,
	options: FilterOptions[],
): FilterOptions[] {
	const changedFilterOptions: FilterOptions[] = options.map((option) => {
		if (option.key === key) return { ...option, isChecked: !option.isChecked };
		return option;
	});

	return changedFilterOptions;
}

/**
 * Получаем из itemTypeOptions массив выбранных имён элементов фильтра'
 * @returns массив выбранных имён приборов
 */
export function getSelectedItemTypeNames(
	itemTypeOptions: FilterOptions[],
): string[] {
	const selectedItemTypes: FilterOptions[] = itemTypeOptions.filter(
		(option: FilterOptions) => Boolean(option.isChecked),
	);
	const itemTypeNames: string[] = selectedItemTypes.map(
		(option: FilterOptions) => option.name,
	);

	return itemTypeNames;
}

/**
 * Окончательно фильтруем и сортируем данные, если переданы фильтры и сортировки
 * @returns отфильтрованный и отсортированный массив данных тела таблицы
 */
export function getFinalTableBodyData(
	tableBody: ITableBody[],
	searchFilters?: SearchFilters,
	sortFilter?: SortOptions,
): ITableBody[] {
	const filteredData: ITableBody[] = searchFilters
		? filterTableBodyBySearchFilters(tableBody, searchFilters)
		: tableBody;

	const finalData: ITableBody[] =
		sortFilter && sortFilter.order !== SortOrder.None
			? sortByOrder(filteredData, sortFilter.accessor, sortFilter.order)
			: filteredData;

	return finalData;
}

export default {};
