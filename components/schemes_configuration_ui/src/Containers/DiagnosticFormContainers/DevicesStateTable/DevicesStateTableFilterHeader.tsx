import clsx from 'clsx';
import { useStore } from 'effector-react';

import Filter from '../../../Icons/Filter';
import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import {
	selectAllBooleanStorageEvent,
	toggleBooleanStorageEvent,
} from '../../../Models/DiagnosticCurrent/events';
import MultiselectDropdown from '../../../UI/MultiselectDropdown';

import { DevicesStateTableFilterHeaderProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableFilterHeader({
	title,
	filterItems,
	filterStorage,
	storageFieldName,
	isSearchBoxVisible = false,
	isSelectAllVisible = false,
	isItemsListVisible = false,
	onApply,
}: DevicesStateTableFilterHeaderProps) {
	const diagnosticCurrentModel = useStore($diagnosticCurrentModel);
	const isFilterActive = Object.values(
		diagnosticCurrentModel[storageFieldName],
	).some((value) => value);
	const iconClass = clsx(styles.filter_icon, {
		[styles.filter_icon__active]: isFilterActive,
	});

	const items = filterItems?.map((item) => ({
		name: item.name,
		key: item.code,
		isChecked: filterStorage[item.code],
	}));

	const handleItemSelect = (dictionaryKey: string) => {
		toggleBooleanStorageEvent({ storageFieldName, dictionaryKey });
	};

	const handleAllSelect = () => {
		const dictionaryKeys = items.map((item) => item.key);
		selectAllBooleanStorageEvent({ storageFieldName, dictionaryKeys });
	};

	return function Render() {
		return (
			<MultiselectDropdown
				items={items}
				title={title}
				className={styles.filter_header}
				rightIcon={<Filter className={iconClass} />}
				isSearchBoxVisible={isSearchBoxVisible}
				isSelectAllVisible={isSelectAllVisible}
				isItemsListVisible={isItemsListVisible}
				onSelect={handleItemSelect}
				onSelectAll={handleAllSelect}
				onApply={onApply}
			/>
		);
	};
}

export default DevicesStateTableFilterHeader;
