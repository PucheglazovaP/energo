import { useCallback, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import useOutsideClick from '../../Hooks/useOutsideClick';
import ArrowIcon from '../../Icons/AngleDown';
import { isHeadingOption } from '../../Shared/Utils/utils';

import Option from './Option';
import OptionHeading from './OptionHeading';
import { DropdownProps, TOption } from './types';

import styles from './Dropdown.module.css';

function Dropdown({
	options,
	selectedOption,
	setSelectedOption,
	isActive,
	isDisabled,
	defaultTitle = 'Выберите значение...',
	className,
}: DropdownProps) {
	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

	const onOptionClick = useCallback(
		(option: TOption) => {
			setDropdownOpen(false);
			setSelectedOption(option);
		},
		[setSelectedOption],
	);

	const title: string = selectedOption?.label
		? selectedOption.label
		: defaultTitle;

	const ref = useOutsideClick(isDropdownOpen, toggleDropdown);

	return (
		<div className={clsx('UI_dropdown', styles.root, className)} ref={ref}>
			<Button
				className={clsx(styles.button, isActive && styles.button__active)}
				onClick={toggleDropdown}
				disabled={isDisabled}
			>
				<p className={styles.title}>{title}</p>
				<div className={clsx(styles.arrow, isDropdownOpen && styles.arrow_up)}>
					<ArrowIcon className={styles.icon} />
				</div>
			</Button>
			{isDropdownOpen && (
				<ul className={styles.menu}>
					{options.map((option) => {
						if (isHeadingOption(option)) {
							return <OptionHeading option={option} key={option.title} />;
						}
						return (
							<Option
								option={option}
								selectedOption={selectedOption}
								onClick={onOptionClick}
								key={option.value}
							/>
						);
					})}
				</ul>
			)}
		</div>
	);
}

export default Dropdown;
