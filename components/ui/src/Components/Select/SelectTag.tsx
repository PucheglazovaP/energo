import { memo, useCallback } from 'react';

import { Close } from '../Icons';

import { SelectTagProps } from './types';
import styles from './Select.module.scss';

function SelectTag(props: SelectTagProps) {
	const { option, onRemove } = props;

	const handleRemove = useCallback(() => {
		onRemove(option);
	}, [option, onRemove]);

	return (
		<div className={styles.tag}>
			<span className={styles.tag__label}>{option.label}</span>
			<button className={styles.tag__button} onClick={handleRemove}>
				<Close height="8" width="8" color={'#000000'} />
			</button>
		</div>
	);
}

export default memo(SelectTag);
