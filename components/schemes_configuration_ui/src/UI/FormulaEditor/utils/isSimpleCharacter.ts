export default function isSimpleCharacter(character: string) {
	return /^and|or|sin|cos|sqrt|power|sign|tan|arcsin|arccos|arctan|case|when|then|end|<fun_1>|<fun_2>|<fun_3>|<fun_4>|<fun_5>|<empty>|<date_part>|<value_start>|<value_before>|<days_of_month>|<=|>=|<>|[0-9.\-+*/<>=(),]$/i.test(
		character,
	);
}
