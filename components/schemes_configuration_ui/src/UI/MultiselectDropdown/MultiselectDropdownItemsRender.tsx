import MultiselectDropdownItemRender from './MultiselectDropdownItem';
import { MultiselectDropdownItemRenderProps } from './types';

import styles from './MultiselectDropdown.module.css';

function MultiselectDropdownItemsRender({
	items,
	onSelect,
}: MultiselectDropdownItemRenderProps) {
	return function Render() {
		return (
			<div className={styles.items_list}>
				{items.map((item) => {
					return (
						<MultiselectDropdownItemRender
							key={item.key}
							item={item}
							onSelect={onSelect}
						/>
					);
				})}
			</div>
		);
	};
}

export default MultiselectDropdownItemsRender;
