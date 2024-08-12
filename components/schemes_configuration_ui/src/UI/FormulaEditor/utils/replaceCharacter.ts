export default function replaceCharacter(character: string) {
	switch (character.toLowerCase()) {
		case '*':
			return '×';
		case 'sqrt':
			return '√';
		case '-':
			return '−';
		case '<fun_1>':
			return ' P';
		case '<fun_2>':
			return ' Дата';
		case '<value_start>':
			return ' ДискретаВремени';
		case '<value_before>':
			return ' ЗначениеНа';
		case '<date_part>':
			return ' DatePart';
		case '<days_of_month>':
			return ' ДнейВМес';
		case '<empty>':
			return '◻';
		case '<>':
			return ' ≠ ';
		case '<=':
			return ' ≤ ';
		case '>=':
			return ' ≥ ';
		case 'and':
			return ' И';
		case 'or':
			return ' ИЛИ';
		case 'gr':
			return ' Гр';
		case 'ch':
			return ' К';
		case 'year':
			return ' Год';
		case 'day':
			return ' Сутки';
		case 'month':
			return ' Месяц';
		case 'quarter':
			return ' Квартал';
		case '_day_of_year':
			return ' ДеньВГоду';
		case 'week':
			return ' Неделя';
		case '_week_day':
			return ' ДеньНедели';
		case 'hour':
			return ' Час';
		case 'minute':
			return ' Минута';
		case 'second':
			return ' Секунда';
		case 'half':
			return ' 30 минут';

		case 'start_shift':
			return ' НачалоСмены';
		case 'start_day':
			return ' НачалоСуток';
		case 'start_month':
			return ' НачалоМесяца';
		default:
			return character;
	}
}
