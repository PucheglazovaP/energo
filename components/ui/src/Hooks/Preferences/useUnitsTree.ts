import {
	SearchUnitsItemsFunction,
	UnitsTreeItem,
} from '../../Types/UnitsTreeTypes';
import { useAppSelector } from '../Store/useAppSelector';

function defaultSearchItems(screenTree: UnitsTreeItem[]) {
	return screenTree;
}

function useUnitsTree(
	parentId?: number,
	searchItems: SearchUnitsItemsFunction = defaultSearchItems,
) {
	const tree = useAppSelector((state) => state.preferenceReducer.units);
	return searchItems(tree).filter(
		(treeElement) => treeElement.parentId === parentId,
	);
}

export default useUnitsTree;
