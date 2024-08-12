import { useState } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import ParameterAction from './ParameterAction';
import ParameterDisplayColor from './ParameterDisplayColor';
import ParameterDisplayFile from './ParameterDisplayFile';
import ParameterDisplayList from './ParameterDisplayList';
import ParameterDisplayRange from './ParameterDisplayRange';
import ParameterDisplayString from './ParameterDisplayString';
import ParameterDisplayToggle from './ParameterDisplayToggle';
import ParameterModal from './ParameterModal';
import {
	ParameterDisplayProps,
	ParameterProps,
	ParameterType,
	TooltipDirection,
} from './types';

import styles from './Parameter.module.css';

const valuesRender: {
	[parameterType: string]: ({
		className,
		style,
		value,
		onClick,
		onModalOpen,
		disabled,
		isHintEnabled,
	}: ParameterDisplayProps) => JSX.Element;
} = {
	[ParameterType.Number]: ParameterDisplayString,
	[ParameterType.Color]: ParameterDisplayColor,
	[ParameterType.Toggle]: ParameterDisplayToggle,
	[ParameterType.File]: ParameterDisplayFile,
	[ParameterType.List]: ParameterDisplayList,
	[ParameterType.Modal]: ParameterModal,
	[ParameterType.Range]: ParameterDisplayRange,
};

function Parameter({
	className,
	style,
	type = ParameterType.Number,
	value,
	onClick,
	caption,
	onModalOpen = () => {},
	onResetClick = () => {},
	onChange = () => {},
	valuesList = [],
	disabled = false,
	isHintEnabled = true,
	parameterComment = '',
}: ParameterProps) {
	const [workingWithData, setWorkingWithData] = useState(false);

	const DisplayComponent = valuesRender[type];

	function workingWit(name: boolean) {
		setWorkingWithData(name);
	}
	return (
		<div
			className={clsx(
				styles.root,
				workingWithData && styles.style_active,
				className,
			)}
			style={style}
		>
			<div className={clsx(styles.param_condition_name)}>
				<Tooltip
					tooltip={parameterComment}
					disabled={!isHintEnabled || parameterComment == ''}
					direction={TooltipDirection.Down}
					className={styles.caption_tooltip}
				>
					<span>{caption}</span>
				</Tooltip>
			</div>
			{workingWithData && (
				<ParameterAction
					workingWit={workingWit}
					value={value}
					onClick={onClick}
					isHintEnabled={isHintEnabled}
				/>
			)}
			<div
				className={clsx(
					styles.param_condition_meaning,
					workingWithData && styles.param_condition_edit_none,
				)}
			>
				<DisplayComponent
					value={value}
					workingWith={workingWit}
					text={''}
					onClick={onClick}
					onModalOpen={onModalOpen}
					onResetClick={onResetClick}
					onChange={onChange}
					valuesList={valuesList}
					disabled={disabled}
					isHintEnabled={isHintEnabled}
				/>
			</div>
		</div>
	);
}

export default Parameter;
