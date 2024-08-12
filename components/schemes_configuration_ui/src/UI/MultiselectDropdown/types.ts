import { ReactNode } from 'react';

export type MultiselectDropdownItem = {
	name: string;
	key: string;
	isChecked?: boolean;
};

export type MultiselectDropdownProps = {
	items?: MultiselectDropdownItem[];
	isSearchBoxVisible?: boolean;
	isSelectAllVisible?: boolean;
	isItemsListVisible?: boolean;
	title?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string;
	tooltipBody?: ReactNode;
	searchFieldPattern?: string;
	onSelect?: (key: string) => void;
	onSelectAll?: () => void;
	onSearch?: (value: string) => void;
	onApply?: () => void;
};

export type MultiselectDropdownItemRenderProps = {
	items: MultiselectDropdownItem[];
	onSelect: (key: string) => void;
};

export type MultiselectDropdownOneItemRenderProps = {
	item: MultiselectDropdownItem;
	onSelect: (key: string) => void;
	className?: string;
};

export type MultiselectDropdownSearchAndSortRenderProps = {
	title?: string;
	filterControlTitle?: string;
	onSearch?: (value: string) => void;
	tooltipBody?: ReactNode;
	placeholder?: string;
	searchValue?: string;
	isSortable?: boolean;
	isSearchable?: boolean;
	hasFilterControl?: boolean;
	isSearchBoxVisible?: boolean;
	sortClassName?: string;
	onSortClick?: (value: string) => void;
	accessor?: string;
	className?: string;
	classNameFilterControl?: string;
	glyph?: ReactNode;
	onApply?: () => void;
	items?: MultiselectDropdownItem[];
	onSelect?: (key: string) => void;
	onSelectAll?: () => void;
	rightIcon?: ReactNode;
};

export type MultiselectDropdownApplyRenderProps = {
	title: string;
	onClick: () => void;
};

export default {};
