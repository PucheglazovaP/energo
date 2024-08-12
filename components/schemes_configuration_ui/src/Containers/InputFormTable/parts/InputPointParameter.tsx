import React from 'react';

import { InputFormPointOptions } from '../../../Models/InputFormPointOptions/types';
import { InputPointType } from '../../EditInputForm/types';

import styles from '../InputFormTable.module.css';

function InputPointParameter({
	type,
	value,
	options,
}: {
	type: string;
	value: string | number | null;
	options: InputFormPointOptions[];
}): JSX.Element {
	if (type === InputPointType.Lookup) {
		const methodName =
			options.find((option) => option.id === Number(value))?.name || '';
		return (
			<span className={styles.item__value} title={methodName}>
				{methodName}
			</span>
		);
	}

	return <span className={styles.item__value}>{value || null}</span>;
}

export default InputPointParameter;
