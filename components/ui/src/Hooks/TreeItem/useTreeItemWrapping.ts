import { useCallback, useEffect, useState } from 'react';

import { SERVER } from '../../Const';
import {
	removeTreeItemsToOpen,
	setCurrentServer,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import { TreeItemType, TreeType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export default function useTreeItemWrapping(
	number: number,
	treeType: TreeType,
	treeItemType: TreeItemType,
) {
	const dispatch = useAppDispatch();
	const { serversList, currentServer, treeItemsToOpen } = useAppSelector(
		(state) => state.configuratorReducer,
	);
	const [isOpen, setIsOpen] = useState(
		treeItemType === SERVER && number === serversList[0].ID,
	);

	const handleOpenTreeItem = useCallback(() => {
		setIsOpen((prevState) => !prevState);
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && treeItemType === SERVER) {
			dispatch(setCurrentServer(number));
		} else if (!isOpen && treeItemType === SERVER && currentServer === number) {
			dispatch(setCurrentServer(null));
		}
	}, [isOpen]);

	useEffect(() => {
		if (currentServer && currentServer === number && treeItemType === SERVER) {
			setIsOpen(true);
		} else if (!currentServer && treeItemType === SERVER) {
			setIsOpen(false);
		}
	}, [currentServer]);

	useEffect(() => {
		treeItemsToOpen?.forEach((treeItem) => {
			if (
				treeItem.itemNumber === number &&
				treeItem.itemType === treeItemType
			) {
				setIsOpen(true);
				dispatch(removeTreeItemsToOpen([treeItem]));
			}
		});
	}, [treeItemsToOpen]);

	return { isOpen, handleOpenTreeItem };
}
