import { memo, useMemo } from 'react';

import SelectPaneItem from './SelectPaneItem';
import { SelectPaneProps } from './types';
import styles from './Select.module.scss';

function SelectPane(props: SelectPaneProps) {
	const { options, isMultiple, onSelect } = props;

	const paneOptions = useMemo(() => {
		const newOptions = [...options];
		if (isMultiple) {
			newOptions.unshift({
				label: 'Выбрать все',
				value: 'all',
				isSelected: options.every((option) => option.isSelected),
			});
		}
		return newOptions;
	}, [options, isMultiple]);

	return (
		<div className={styles.pane}>
			{!!options.length &&
				paneOptions.map((option) => (
					<SelectPaneItem
						key={option.value}
						option={option}
						isMultiple={isMultiple}
						onSelect={onSelect}
					/>
				))}
		</div>
	);
}

export default memo(SelectPane);
