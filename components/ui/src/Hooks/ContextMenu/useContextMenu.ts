import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import {
	setContextMenuId,
	setContextMenuItems,
	setContextMenuItemTitle,
	setContextMenuParentId,
	setContextMenuPosition,
	setContextMenuType,
} from '../../Store/reducers/ContextMenuSlice/contextMenuSlice';
import { ContextMenuType } from '../../Types/ContextMenuTypes';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

import { useContextMenuDictionary } from './useContextMenuDictionary';

export function useContextMenu() {
	const dispatch = useAppDispatch();
	const { items, position, type } = useAppSelector(
		(state) => state.contextMenuReducer,
	);
	const { contextMenuDictionary } = useContextMenuDictionary();
	const closeMenu = useCallback(() => {
		dispatch(setContextMenuPosition([-1000, -1000]));
		dispatch(setContextMenuItems([]));
	}, [dispatch]);

	const contextMenuItems = useMemo(
		() => contextMenuDictionary[type],
		[type, contextMenuDictionary],
	);

	const contextRef = useRef<HTMLUListElement>(null);
	useLayoutEffect(() => {
		if (
			Number(position[0]) + Number(contextRef.current?.offsetWidth) >
			window.innerWidth
		) {
			dispatch(
				setContextMenuPosition([
					Number(position[0]) - Number(contextRef.current?.offsetWidth),
					Number(position[1]),
				]),
			);
		}
		if (
			Number(position[1]) + Number(contextRef.current?.offsetHeight) >
			window.innerHeight
		) {
			dispatch(
				setContextMenuPosition([
					Number(position[0]),
					Number(position[1]) - Number(contextRef.current?.offsetHeight),
				]),
			);
		}
	}, [position]);

	useEffect(() => {
		if (items.length) document.body.addEventListener('click', closeMenu);
		return () => {
			document.body.removeEventListener('click', closeMenu);
		};
	}, [items, closeMenu]);

	const setContextMenu = useCallback(
		(
			id: number,
			parentId: number,
			menuType: ContextMenuType,
			position: number[],
			itemName: string,
		) => {
			dispatch(setContextMenuId(id));
			dispatch(setContextMenuParentId(parentId));
			dispatch(setContextMenuType(menuType));
			dispatch(setContextMenuItems(contextMenuDictionary[menuType]));
			dispatch(setContextMenuPosition(position));
			dispatch(setContextMenuItemTitle(itemName));
		},
		[contextMenuDictionary, dispatch],
	);
	return { setContextMenu, position, contextMenuItems, closeMenu, contextRef };
}
