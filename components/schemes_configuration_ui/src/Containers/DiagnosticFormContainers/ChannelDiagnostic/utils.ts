import { MultiselectDropdownItem } from '../../../UI/MultiselectDropdown/types';

export function mapFilterStorageWithIndicator(
	storage: MultiselectDropdownItem[],
	indicators: Map<string, boolean>,
): MultiselectDropdownItem[] {
	const finalStorage: MultiselectDropdownItem[] = storage.map((item) => {
		return {
			key: item.key,
			name: item.name,
			isChecked: !!indicators.get(item.key),
		};
	});
	return finalStorage;
}
