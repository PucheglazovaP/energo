import { useCallback } from 'react';

import { updateElementsLists } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import { UpdateElementsListParamsType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';

export function useConfiguratorTree() {
	const dispatch = useAppDispatch();
	const updateElementsList = useCallback(
		({
			fkNumber,
			itemType,
			treeType,
			serverId,
		}: UpdateElementsListParamsType) => {
			dispatch(updateElementsLists(fkNumber, itemType, treeType, serverId));
		},
		[dispatch],
	);
	return { updateElementsList };
}
