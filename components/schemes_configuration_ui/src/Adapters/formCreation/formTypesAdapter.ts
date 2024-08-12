import { FormType, FormTypeResponse } from '../../Models/NewForm/types';

export function formTypesAdapter(body: string) {
	const formTypes: FormTypeResponse[] =
		JSON.parse(body).Response.Tables[0].Rows;
	const result: FormType[] = formTypes.map((formType) => ({
		code: formType.КодТипаФормы,
		comment: formType.Комментарий,
		name: formType.НазваниеТипаФормы,
		number: formType.НомертипаФормы,
		// Select options
		value: formType.КодТипаФормы,
		label: formType.НазваниеТипаФормы,
		isSelected: false,
	}));
	return result;
}
