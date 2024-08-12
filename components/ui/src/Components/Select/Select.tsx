import { memo, useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import { useOnClickOutside } from '../../Hooks/useOnClickOutside';
import { Arrow, Close } from '../Icons';
import { ArrowDirection } from '../Icons/types';

import SelectField from './SelectField';
import SelectPane from './SelectPane';
import { SelectOption, SelectProps, SelectVariant } from './types';
import styles from './Select.module.scss';

function Select(props: SelectProps) {
	const {
		onSelect,
		isClearable = false,
		options,
		isMultiple = false,
		placeholder = 'Наименование...',
		legend,
		disabled,
		variant = SelectVariant.PRIMARY,
		className,
	} = props;

	const [isPaneOpen, setIsPaneOpen] = useState<boolean>(false);
	const selectRef = useRef(null);

	const clearAll = useCallback(() => {
		const newOptions = options.map((option) => ({
			...option,
			isSelected: false,
		}));
		onSelect(newOptions);
	}, [onSelect, options]);

	const selectAll = useCallback(() => {
		const newOptions = options.map((option) => ({
			...option,
			isSelected: true,
		}));
		onSelect(newOptions);
	}, [onSelect, options]);

	const openPane = useCallback(() => {
		setIsPaneOpen(true);
	}, []);
	const closePane = useCallback(() => {
		setIsPaneOpen(false);
	}, []);

	// Handle single select options
	const onChooseOption = useCallback(
		(option: SelectOption) => {
			const newOptions = options.map((opt) => ({ ...opt, isSelected: false }));
			const foundOption = newOptions.find((opt) => opt.value === option.value);
			if (foundOption) {
				foundOption.isSelected = true;
			}
			onSelect(newOptions);
			closePane();
		},
		[options, onSelect],
	);

	// Handle multiple select options
	const onToggleOption = useCallback(
		(option: SelectOption) => {
			// Handle 'all' option
			if (option.value === 'all') {
				const isAllSelected = options.every((opt) => opt.isSelected);
				if (isAllSelected) {
					clearAll();
					return;
				}
				selectAll();
				return;
			}
			const newOptions = options.map((opt) => ({ ...opt }));
			const foundOption = newOptions.find((opt) => opt.value === option.value);
			if (foundOption) {
				foundOption.isSelected = !foundOption.isSelected;
			}
			onSelect(newOptions);
		},
		[onSelect, options, clearAll, selectAll],
	);

	useOnClickOutside(selectRef, closePane);

	return (
		<div className={clsx(styles.select, className)} ref={selectRef}>
			<span className={styles.select__legend}>{legend}</span>
			<div
				className={clsx(
					styles.select__body,
					isMultiple ? styles.select__multiple : styles.select__single,
					{
						[styles.select__primary]: variant === SelectVariant.PRIMARY,
						[styles.select__secondary]: variant === SelectVariant.SECONDARY,
						[styles.select__disabled]: disabled,
					},
				)}
			>
				<SelectField
					options={options}
					isMultiple={isMultiple}
					placeholder={placeholder}
					onRemove={onToggleOption}
				/>
				{isClearable && (
					<button className={styles.select__clear} onClick={clearAll}>
						<Close width={'8'} height={'8'} />
					</button>
				)}
				<button
					className={styles.select__toggle}
					onClick={isPaneOpen ? closePane : openPane}
				>
					<Arrow
						direction={isPaneOpen ? ArrowDirection.UP : ArrowDirection.DOWN}
					/>
				</button>
			</div>
			{isPaneOpen && (
				<SelectPane
					options={options}
					isMultiple={isMultiple}
					onSelect={isMultiple ? onToggleOption : onChooseOption}
				/>
			)}
		</div>
	);
}

export default memo(Select);
