import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import ContextMenu from '../ContextMenu';

import { MultiselectDropdownProps } from './types';
import useMultiselectDropdownProps from './useMultiselectDropdownProps';

import styles from './MultiselectDropdown.module.css';

function MultiselectDropdown({
	title,
	leftIcon,
	rightIcon,
	items = [],
	className,
	isSearchBoxVisible,
	isSelectAllVisible,
	isItemsListVisible,
	tooltipBody,
	searchFieldPattern,
	onSelect = () => {},
	onSelectAll = () => {},
	onApply = () => {},
	onSearch = () => {},
}: MultiselectDropdownProps) {
	const { menuItems, menuPosition, setMenuPosition, handlePopupOpen } =
		useMultiselectDropdownProps(
			Boolean(isSearchBoxVisible),
			Boolean(isSelectAllVisible),
			Boolean(isItemsListVisible),
			items,
			onSelect,
			onSelectAll,
			onApply,
			onSearch,
			tooltipBody,
			searchFieldPattern,
		);

	return (
		<div className={clsx(styles.filter_control, className)}>
			<Button
				className={styles.filter_control_button}
				onClick={handlePopupOpen}
			>
				{leftIcon}
				{title && <span>{title}</span>}
				{rightIcon}
			</Button>
			{menuPosition && (
				<ContextMenu
					className={styles.filter_control_context_menu}
					items={menuItems}
					position={menuPosition}
					setPosition={setMenuPosition}
				/>
			)}
		</div>
	);
}

export default MultiselectDropdown;
