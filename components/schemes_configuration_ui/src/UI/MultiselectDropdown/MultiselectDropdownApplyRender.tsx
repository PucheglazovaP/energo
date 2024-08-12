import { Button } from '@evraz/ui-kit';

import { MultiselectDropdownApplyRenderProps } from './types';

import styles from './MultiselectDropdown.module.css';

function MultiselectDropdownApplyRender({
	title,
	onClick,
}: MultiselectDropdownApplyRenderProps) {
	return function Render() {
		return (
			<div className={styles.apply_button_container}>
				<Button onClick={onClick} primary>
					{title}
				</Button>
			</div>
		);
	};
}

export default MultiselectDropdownApplyRender;
