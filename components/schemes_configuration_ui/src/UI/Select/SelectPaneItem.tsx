import { memo, useCallback } from 'react';

import Switcher from '../Switcher';

import { SelectPaneItemProps } from './types';

import styles from './Select.module.css';

function SelectPaneItem(props: SelectPaneItemProps) {
	const { option, onSelect, isMultiple } = props;

	const handleSelect = useCallback(() => {
		onSelect(option);
	}, [option, onSelect]);
	return (
		<button className={styles.pane__item} onClick={handleSelect}>
			{isMultiple && <Switcher checked={option.isSelected} type={'checkbox'} />}
			<span className={styles.pane__text} title={option.label}>
				{option.label}
			</span>
		</button>
	);
}

export default memo(SelectPaneItem);
