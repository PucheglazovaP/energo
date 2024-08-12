import {
	ChangeEvent,
	FC,
	MouseEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import clsx from 'clsx';

import { EditableFieldProps } from './types';

import styles from './EditableField.module.css';

const EditableField: FC<EditableFieldProps> = ({
	className,
	value,
	onChange = () => {},
}) => {
	const [inputValue, setValue] = useState(value);
	const [isEditingEnabled, setEditingMode] = useState(false);

	useEffect(() => {
		setValue(value);
	}, [value]);

	const saveValue = useCallback(() => {
		if (value !== inputValue) {
			onChange(inputValue);
		}
	}, [inputValue]);

	const onKeyPress = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				saveValue();
				setEditingMode(false);
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
	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		setEditingMode(false);
	};
	return (
		<button className={clsx(styles.root, className)} onClick={handleClick}>
			{isEditingEnabled ? (
				<input
					className={styles.name}
					value={inputValue}
					onChange={handleInputChange}
				/>
			) : (
				<div className={styles.name}>{value || 'Наименование'}</div>
			)}
		</button>
	);
};

export default EditableField;
