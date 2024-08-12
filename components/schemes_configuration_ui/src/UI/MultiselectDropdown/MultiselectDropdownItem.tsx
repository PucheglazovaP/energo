import clsx from 'clsx';

import Checkbox from '../Checkbox';

import { MultiselectDropdownOneItemRenderProps } from './types';

import styles from './MultiselectDropdown.module.css';

function MultiselectDropdownItemRender({
	item,
	onSelect,
	className,
}: MultiselectDropdownOneItemRenderProps) {
	const { key, name, isChecked } = item;

	const handleItemSelect = (key: string) => () => {
		onSelect(key);
	};

	return (
		<div key={key} className={clsx(styles.item_render, className)}>
			<Checkbox
				className={styles.item_render_checkbox}
				name={key}
				checked={Boolean(isChecked)}
				onChange={handleItemSelect(key)}
			/>
			{name}
		</div>
	);
}

export default MultiselectDropdownItemRender;
