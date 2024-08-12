export function getInputTooltipTextBySelectedFilterMode(filterMode: number) {
	switch (filterMode) {
		case 1:
			return '';
		case 2:
		case 4:
			return '% - произвольное количество символов\n _  - один символ';
		case 3:
			return '';
		default:
			return '';
	}
}
export function getSelectTooltipTextBySelectedFilterMode(filterMode: number) {
	switch (filterMode) {
		case 1:
			return '№ прибора';
		case 2:
			return 'Наименование прибора';
		case 4:
			return 'Наименование канала';
		case 3:
			return '№ канала';
		default:
			return '';
	}
}
