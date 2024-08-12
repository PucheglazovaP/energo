import {
	BackendResponse,
	FormulaElement,
	GroupComponentsTree,
	GroupComponentsTreeResponse,
} from '../Shared/types';

export function formulaFromDBAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const formulaElements = Response.Tables[0].Rows as FormulaElement[];
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
export function groupComponentsTreeAdapter(
	result: string,
): GroupComponentsTree[] {
	const { Response }: BackendResponse = JSON.parse(result);
	const groupComponents = Response.Tables[0]
		.Rows as GroupComponentsTreeResponse[];

	return groupComponents.map((item) => ({
		isGroup: Boolean(Number(item.IsGroup)),
		idCompanent: item.ID_Companent,
		name: item.Name,
		unitName: item.UnitName,
		order: item.Ord,
		id: item.ID,
		parentId: item.PID || undefined,
		activeFormula: item.ActiveFormula || false,
		chOb: item.ChOb,
		ki: item.KI,
		ku: item.KU,
		value: item.Value ? item.Value.toFixed(2) : null,
		unitID: item.UnitID,
		koef: item.Koef,
		isConsumption: Boolean(Number(item.IsConsumption)),
		typeStorage: item.FK_TypeStorage
			? 'Нерегламентированные данные'
			: 'Регламентированные данные',
		methodName: item.FK_MetodName,
	}));
}
