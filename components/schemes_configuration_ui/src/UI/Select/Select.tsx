import { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import useOutsideClick from '../../Facades/useOutsideClick';
import { Angle, Close } from '../../Icons';
import { Direction } from '../../Icons/types';

import SelectField from './SelectField';
import SelectPane from './SelectPane';
import { SelectOption, SelectProps, SelectVariant } from './types';

import styles from './Select.module.css';

function Select(props: SelectProps) {
	const {
		onSelect,
		isClearable = false,
		options,
		isMultiple = false,
		placeholder = 'Наименование...',
		legend,
		disabled,
		isRequired,
		variant,
		className,
		label,
	} = props;

	const [isPaneOpen, setIsPaneOpen] = useState<boolean>(false);

	const isOptionSelected = useMemo(
		() => options.some((option) => option.isSelected),
		[options],
	);

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

	const selectRef = useOutsideClick(isPaneOpen, closePane);

	return (
		<div className={clsx(styles.select, className)} ref={selectRef}>
			{!label && (
				<span
					className={clsx(styles.select__legend, {
						[styles.select__legend_error]: isRequired && !isOptionSelected,
					})}
				>
					{legend}
				</span>
			)}
			<div
				className={clsx(
					styles.select__body,
					!isOptionSelected && styles.select_option__inactive,
					isPaneOpen && styles.select__active,
					{
						[styles.select__single]: !isMultiple,
						[styles.select__multiple]: isMultiple,
						[styles.select__primary]: variant === SelectVariant.Primary,
						[styles.select__secondary]: variant === SelectVariant.Secondary,
						[styles.select__disabled]: disabled,
						[styles.select__required]: isRequired && !isOptionSelected,
					},
				)}
			>
				<SelectField
					options={options}
					placeholder={placeholder}
					isMultiple={isMultiple}
					onRemove={onToggleOption}
					onClick={isPaneOpen ? closePane : openPane}
				/>
				{isClearable && (
					<button className={styles.select__action} onClick={clearAll}>
						<Close />
					</button>
				)}
				<button
					className={clsx(styles.select__toggle, styles.select__action)}
					onClick={isPaneOpen ? closePane : openPane}
				>
					<Angle direction={isPaneOpen ? Direction.UP : Direction.DOWN} />
				</button>
			</div>
			{isRequired && !isOptionSelected && (
				<span className={styles.select__error}>
					Поле обязательно для заполнения
				</span>
			)}
			{isPaneOpen && (
				<SelectPane
					options={options}
					isMultiple={isMultiple}
					onSelect={isMultiple ? onToggleOption : onChooseOption}
				/>
			)}
			{label && (
				<span className={clsx(styles.label)}>
					<span>{label}</span>
					{isRequired && <span className={styles['required_marker']}>*</span>}
				</span>
			)}
		</div>
	);
}

export default memo(Select);
