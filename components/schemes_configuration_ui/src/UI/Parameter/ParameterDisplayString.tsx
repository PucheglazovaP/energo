import React, { useCallback, useEffect, useId, useState } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { IconCircularArrows } from './iconEditing';
import { ParameterDisplayProps, TooltipDirection } from './types';

import styles from './Parameter.module.css';

function ParameterDisplayString({
	className,
	style,
	value,
	onClick,
	onResetClick,
	isHintEnabled,
	disabled,
}: ParameterDisplayProps) {
	const [inputValue, setValue] = useState<string>('');

	useEffect(() => {
		const result = value != null ? value : '';
		setValue(result);
	}, [value]);

	const saveValue = useCallback(() => {
		if (value !== inputValue) {
			onClick && onClick(inputValue);
		}
	}, [inputValue]);

	const onKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				saveValue();
			}
		},
		[saveValue],
	);
	const ApplyingDefaultValues = () => {
		onResetClick && onResetClick();
	};
	const id = useId();

	return (
		<div
			className={clsx(styles.parameter_display_number, className)}
			style={style}
		>
			{!disabled ? (
				<input
					className={clsx(styles.paramp_action_input)}
					value={inputValue}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					onKeyDown={onKeyPress}
				/>
			) : (
				inputValue
			)}
			{!disabled && (
				<Tooltip
					disabled={!isHintEnabled}
					tooltip="По умолчанию"
					forceDirection={TooltipDirection.Left}
				>
					<button
						key={id}
						className={clsx(styles.param_double_lines)}
						onClick={ApplyingDefaultValues}
					>
						<IconCircularArrows />
					</button>
				</Tooltip>
			)}
			{/*
			Assign a default value
			<button
				className={clsx(styles.param_condition_edit)}
				onClick={startEditing}
			>
				<IconEditing />
			</button> */}
		</div>
	);
}
export default ParameterDisplayString;
