import MultiselectDropdownItem from './MultiselectDropdownItem';
import { MultiselectDropdownOneItemRenderProps } from './types';

function MultiselectDropdownOneItemRender({
	item,
	onSelect,
	className,
}: MultiselectDropdownOneItemRenderProps) {
	return function Render() {
		return (
			<MultiselectDropdownItem
				className={className}
				item={item}
				onSelect={onSelect}
			/>
		);
	};
}

export default MultiselectDropdownOneItemRender;
