import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { OptionProps } from './types';

import styles from './Dropdown.module.css';

function Option(props: OptionProps) {
	const { option, selectedOption, onClick } = props;

	const handleClick = () => {
		onClick(option);
	};

	return (
		<li
			className={clsx(
				styles.menu__item,
				option.value === selectedOption?.value && styles.selected,
			)}
		>
			<Button
				className={styles.menu__btn}
				onClick={handleClick}
				disabled={option.disabled}
			>
				{option.label}
			</Button>
		</li>
	);
}

export default Option;
