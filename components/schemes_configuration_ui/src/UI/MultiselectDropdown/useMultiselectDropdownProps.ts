import { MouseEvent, ReactNode, useMemo, useState } from 'react';

import { ContextMenuItem, NullableMenuPosition } from '../ContextMenu/types';

import MultiselectDropdownApplyRender from './MultiselectDropdownApplyRender';
import MultiselectDropdownItemRender from './MultiselectDropdownItemRender';
import MultiselectDropdownItemsRender from './MultiselectDropdownItemsRender';
import MultiselectDropdownNoDataRender from './MultiselectDropdownNoDataRender';
import MultiselectDropdownSearchAndSortRender from './MultiselectDropdownSearchAndSortRender';
import { MultiselectDropdownItem } from './types';

import styles from './MultiselectDropdown.module.css';

function useMultiselectDropdownProps(
	isSearchBoxVisible: boolean,
	isSelectAllVisible: boolean,
	isItemsListVisible: boolean,
	items: MultiselectDropdownItem[],
	onSelect: (key: string) => void,
	onSelectAll: () => void,
	onApply: () => void,
	onSearch: (value: string) => void,
	tooltipBody?: ReactNode,
	searchFieldPattern?: string,
) {
	const [searchValue, setSearchValue] = useState('');
	const [menuPosition, setMenuPosition] = useState<NullableMenuPosition>(null);

	const filteredItems = useMemo(
		() =>
			items?.filter((item) =>
				item.name?.toLowerCase().includes(searchValue.toLowerCase()),
			),
		[items, searchValue],
	);

	const menuItems = useMemo(() => {
		if (!menuPosition) {
			return [];
		}

		const dataItems: ContextMenuItem[] = [];

		if (isSearchBoxVisible) {
			dataItems.push({
				name: 'search',
				isNotCloseOnClick: true,
				isNotButton: true,
				renderFn: MultiselectDropdownSearchAndSortRender({
					placeholder: 'Поиск...',
					searchValue,
					tooltipBody: tooltipBody,
					onSearch: (value: string) => {
						if (value === '' || !searchFieldPattern) {
							setSearchValue(value);
							onSearch(value);
						} else {
							const regEx = new RegExp(searchFieldPattern);
							if (regEx.test(value)) {
								setSearchValue(value);
								onSearch(value);
							}
						}
					},
					isSortable: false,
					isSearchable: true,
				}),
			});
		}

		if (isItemsListVisible && filteredItems.length === 0) {
			dataItems.push({
				name: 'noData',
				isNotCloseOnClick: true,
				isNotButton: true,
				renderFn: MultiselectDropdownNoDataRender(),
			});
		} else if (isItemsListVisible) {
			dataItems.push({
				name: 'items',
				isNotCloseOnClick: true,
				isNotButton: true,
				renderFn: MultiselectDropdownItemsRender({
					items: filteredItems,
					onSelect,
				}),
			});

			if (isSelectAllVisible) {
				dataItems.push({
					name: 'selectAll',
					isNotCloseOnClick: true,
					isNotButton: true,
					renderFn: MultiselectDropdownItemRender({
						item: {
							name: 'Выбрать все',
							key: 'selectAll',
							isChecked: filteredItems.some((item) => item.isChecked),
						},
						onSelect: onSelectAll,
						className: styles.select_all,
					}),
				});
			}
		}

		dataItems.push({
			name: 'apply',
			isNotButton: true,
			renderFn: MultiselectDropdownApplyRender({
				title: 'Применить',
				onClick: () => {
					onApply();
					setMenuPosition(null);
				},
			}),
		});

		return dataItems;
	}, [
		filteredItems,
		isItemsListVisible,
		isSearchBoxVisible,
		isSelectAllVisible,
		menuPosition,
		onApply,
		onSearch,
		onSelect,
		onSelectAll,
		searchFieldPattern,
		searchValue,
		tooltipBody,
	]);

	const handlePopupOpen = (event: MouseEvent<HTMLButtonElement>) => {
		const element = event.target as HTMLElement;
		const rect = element.getBoundingClientRect();
		const x = event.clientX - rect.left; //x position within the element.
		const y = event.clientY - rect.top; //y position within the element.

		setMenuPosition({ x, y });
		event.preventDefault();
		event.stopPropagation();
	};

	return {
		menuItems,
		menuPosition,
		setMenuPosition,
		handlePopupOpen,
	};
}

export default useMultiselectDropdownProps;
