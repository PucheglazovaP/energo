import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { SelectedItemInfoProps } from './types';

import styles from './SelectedItemInfo.module.css';

const SelectedItemInfo: FC<SelectedItemInfoProps> = ({
	className,
	type,
	name,
	isFormSelected = false,
	onChange = () => {},
}) => {
	const [inputValue, setValue] = useState(name);

	useEffect(() => {
		setValue(name);
	}, [name]);

	const saveValue = useCallback(() => {
		if (name !== inputValue) {
			onChange(inputValue);
		}
	}, [inputValue]);

	const onKeyPress = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				saveValue();
			}
		},
		[saveValue],
	);
	useEffect(() => {
		window.addEventListener('keydown', onKeyPress);

		return () => {
			window.removeEventListener('keydown', onKeyPress);
		};
	}, [onKeyPress]);
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	return (
		<div className={clsx(styles.root, className)}>
			<span className={styles.type}> {type || 'Тип'}</span>
			{isFormSelected ? (
				<input
					className={styles.name}
					value={inputValue}
					onChange={handleInputChange}
				/>
			) : (
				<div className={styles.name}>{name || 'Наименование'}</div>
			)}
		</div>
	);
};

export default SelectedItemInfo;
