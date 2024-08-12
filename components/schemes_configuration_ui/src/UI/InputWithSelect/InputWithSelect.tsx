import { ForwardedRef, forwardRef } from 'react';
import { Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';

import Input from '../Input/Input';
import Select from '../Select';

import { InputWithSelectProps } from './types';

import styles from './InputWithSelect.module.css';

const InputWithSelect = forwardRef(function InputWithSelect(
	props: InputWithSelectProps,
	inputRef: ForwardedRef<HTMLInputElement>,
) {
	const {
		value,
		options,
		onChange,
		onSelect,
		className,
		isDisabled,
		tooltipTextForSelector,
		tooltipTextForInput,
	} = props;
	return (
		<div
			className={clsx(styles.root, styles.container, className, {
				[styles.container__disabled]: isDisabled,
			})}
		>
			<div className={styles.tooltip_input_wrapper}>
				<Tooltip
					tooltip={tooltipTextForInput}
					disabled={!tooltipTextForInput}
					forceDirection={TooltipDirection.Down}
				>
					<Input
						value={value}
						onChange={onChange}
						className={clsx(styles.controller, styles.input)}
						ref={inputRef}
						key="input"
					/>
				</Tooltip>
			</div>
			<div className={styles.tooltip_select_wrapper}>
				<Tooltip
					tooltip={tooltipTextForSelector}
					disabled={!tooltipTextForSelector}
					direction={TooltipDirection.Down}
					className={styles.tooltip}
				>
					<div key="select">
						<Select
							options={options}
							onSelect={onSelect}
							className={clsx(styles.controller, styles.select)}
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	);
});

InputWithSelect.displayName = 'InputWithSelect';

export default InputWithSelect;
