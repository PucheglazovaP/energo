import { ChangeEvent, useEffect, useState } from 'react';

import Input from '../../UI/Input';

import { InputCellProps } from './types';

function InputCell({ value, onEdit }: InputCellProps) {
	const [inputValue, setInputValue] = useState(value || '');
	useEffect(() => {
		setInputValue(value || '');
	}, [value]);
	return (
		<Input
			defaultValue={value ? Number(value) : ''}
			value={inputValue}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				setInputValue(e.target.value ? e.target.value : '');
			}}
			onBlur={(e: ChangeEvent<HTMLInputElement>) => {
				onEdit(e.target.value ? e.target.value : null);
			}}
		/>
	);
}

export default InputCell;
