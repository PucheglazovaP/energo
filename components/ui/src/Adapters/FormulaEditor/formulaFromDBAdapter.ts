import { FormulaElement } from '../../Store/reducers/FormulaEditorSlice/types';

export function formulaFromDBAdapter(formulaElements: FormulaElement[]) {
	let buffer: string = '';
	for (const { ID_Group, Oper, ID_Channel } of formulaElements) {
		if (ID_Channel) {
			buffer += `ch(${ID_Channel})`;
			continue;
		}

		if (ID_Group) {
			buffer += `gr(${ID_Group})`;
			continue;
		}

		if (Oper) {
			let operator = Oper.toLowerCase().trim();
			if (Oper[0] === "'") {
				buffer += operator.replace(' ', '_');
				continue;
			}
			buffer += operator;
		}
	}
	return buffer;
}
