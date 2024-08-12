import { FormTreeItem } from '../../Models/TreeForms/types';

export function getSelectedForm(
	forms: FormTreeItem[],
	id: number,
): FormTreeItem | undefined {
	const selectedForm = forms.find((form) => form.id === id);
	return selectedForm;
}
