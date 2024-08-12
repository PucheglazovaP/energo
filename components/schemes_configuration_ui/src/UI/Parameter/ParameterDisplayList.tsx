import { useEffect, useId, useState } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import Selector from '../Selector';

import { IconCircularArrows } from './iconEditing';
import { ParameterDisplayProps, TooltipDirection } from './types';

import styles from './Parameter.module.css';

function ParameterDisplayList({
	className,
	style,
	value,
	valuesList = [],
	onClick,
	onResetClick,
	isHintEnabled,
}: ParameterDisplayProps) {
	const [valueMenu, setValueMenu] = useState(value);
	const id = useId();

	const handleSelect = (selectedValue: string) => {
		setValueMenu(selectedValue);
		const value = valuesList.find(
			(item) => item.value === selectedValue,
		)?.value;

		if (value) onClick && onClick(value);
	};
	const ApplyingDefaultValues = () => {
		onResetClick && onResetClick();
	};

	useEffect(() => {
		setValueMenu(value);
	}, [value]);
	return (
		<div
			className={clsx(styles.parameter_display_list, className)}
			style={style}
		>
			<Selector
				multipleChoice={valueMenu == '' || valueMenu == null}
				options={valuesList}
				selectedOption={valueMenu || ''}
				setSelectedOption={handleSelect}
				className={styles.selector}
			/>
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
		</div>
	);
}
export default ParameterDisplayList;
