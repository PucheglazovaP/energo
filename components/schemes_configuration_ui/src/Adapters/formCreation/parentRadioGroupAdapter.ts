import { ParentRadioGroup } from '../../Containers/FormCreation/types';
import { FormOperation } from '../../Models/NewForm/types';
import { TreeItem } from '../../UI/Tree/types';

export function parentRadioGroupAdapter(
	tree: TreeItem[],
	activeId: number,
	operation?: FormOperation,
): ParentRadioGroup[] {
	// Add first option that means that new form will not have parent
	// If modal is 'NEW FORM' - make it default
	const result: ParentRadioGroup[] = [
		{
			name: 'Не указывать',
			value: '0',
			checked: operation === FormOperation.NEW,
			disabled: false,
			type: 'parent',
		},
	];
	// Find chosen form in the tree and add it as parent option
	const chosenForm = tree.find((node) => node.id === activeId);
	if (chosenForm) {
		// Find parent form of the chosen one and add it as parent option
		const parentForm = tree.find((node) => node.id === chosenForm.parentId);
		if (parentForm) {
			result.push({
				name: parentForm.displayName,
				value: String(parentForm.id),
				checked: false,
				disabled: false,
				type: 'child',
			});
		}

		// If modal is 'COPY' - make it default
		result.push({
			name: chosenForm.displayName,
			value: String(chosenForm.id),
			checked: operation !== FormOperation.NEW,
			disabled: false,
			type: 'parent',
		});
	}

	return result;
}
