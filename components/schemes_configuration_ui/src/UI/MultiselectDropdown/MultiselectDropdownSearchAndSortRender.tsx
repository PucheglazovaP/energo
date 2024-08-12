import { ChangeEvent } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Sort } from '../../Icons';
import CircleInfo from '../../Icons/CircleInfo';
import FilterIcon from '../../Icons/Filter';
import { TooltipDirection } from '../../Shared/types';
import Input from '../Input';

import FilterControl from './MultiselectDropdown';
import { MultiselectDropdownSearchAndSortRenderProps } from './types';

import styles from './MultiselectDropdown.module.css';

function MultiselectDropdownSearchAndSortRender({
	// responds for adding title to the component
	title,
	placeholder,
	// responds for adding tooltip to the component
	tooltipBody,
	onSearch = () => {},
	searchValue,
	// responds for adding sort button to the component
	isSortable,
	// responds for adding search input to the component
	isSearchable,
	sortClassName,
	onSortClick = () => {},
	accessor = '',
	className,
	classNameFilterControl,
	glyph,
	// responds for adding dropdown to the component
	hasFilterControl,
	filterControlTitle,
	onApply = () => {},
	items = [],
	onSelect = () => {},
	onSelectAll = () => {},
	rightIcon,
	isSearchBoxVisible = true,
}: MultiselectDropdownSearchAndSortRenderProps) {
	return function Render() {
		const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
			onSearch(event.target.value);
		};

		const onSortButtonClick = () => {
			onSortClick(accessor);
		};

		return (
			<div className={clsx(styles.search_box_container, className)}>
				{title && (
					<span className={styles.title} title={title}>
						{title}
					</span>
				)}
				{isSearchable && (
					<Input
						type="search"
						isSearch
						placeholder={placeholder}
						value={searchValue}
						onChange={handleValueChange}
						className={styles.input_container}
						glyph={glyph}
					/>
				)}
				{tooltipBody && (
					<Tooltip direction={TooltipDirection.Right} tooltip={tooltipBody}>
						<div className={styles.search_box_tooltip}>
							<CircleInfo className={styles.tooltip_icon} />
						</div>
					</Tooltip>
				)}
				{isSortable && (
					<button className={styles.sort_button} onClick={onSortButtonClick}>
						<Sort className={sortClassName} />
					</button>
				)}
				{hasFilterControl && (
					<FilterControl
						title={filterControlTitle}
						rightIcon={
							rightIcon ? (
								rightIcon
							) : (
								<FilterIcon className={styles.filter_icon} />
							)
						}
						onApply={onApply}
						items={items}
						onSelect={onSelect}
						onSelectAll={onSelectAll}
						isItemsListVisible
						isSearchBoxVisible={isSearchBoxVisible}
						isSelectAllVisible
						className={classNameFilterControl}
					/>
				)}
			</div>
		);
	};
}

export default MultiselectDropdownSearchAndSortRender;
