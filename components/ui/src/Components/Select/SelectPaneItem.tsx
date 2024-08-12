import { memo, useCallback } from 'react';

import CheckBox from '../../UI/CheckBox/CheckBox';

import { SelectPaneItemProps } from './types';
import styles from './Select.module.scss';

function SelectPaneItem(props: SelectPaneItemProps) {
	const { option, isMultiple, onSelect } = props;

	const handleSelect = useCallback(() => {
		onSelect(option);
	}, [option, onSelect]);
	return (
		<button className={styles.pane__item} onClick={handleSelect}>
			{isMultiple && (
				<CheckBox
					id={option.value.toString()}
					isChecked={option.isSelected}
					setChecked={handleSelect}
				/>
			)}
			<span className={styles.pane__text}>{option.label}</span>
		</button>
	);
}

export default memo(SelectPaneItem);
