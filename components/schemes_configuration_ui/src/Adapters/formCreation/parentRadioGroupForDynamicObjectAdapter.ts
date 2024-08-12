import { ParentRadioGroup } from '../../Containers/FormCreation/types';
import { TreeItem } from '../../UI/Tree/types';

function parentRadioGroupForDynamicObjectAdapter(
	tree: TreeItem[],
	activeId: number,
): ParentRadioGroup[] {
	const chosenForm: TreeItem | undefined = tree.find(
		(node) => node.id === activeId,
	);
	if (!chosenForm) {
		return [];
	}
	const result: ParentRadioGroup[] = [
		{
			name: chosenForm.displayName,
			checked: true,
			type: 'parent',
			value: String(chosenForm.id),
		},
	];
	return result;
}

export default parentRadioGroupForDynamicObjectAdapter;
