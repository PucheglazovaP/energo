import { useState } from 'react';
import clsx from 'clsx';

import ParameterAction from './ParameterAction';
import ParameterDisplayToggle from './ParameterDisplayToggle';
import { ParameterDisplayProps, ParameterProps, ParameterType } from './types';

import styles from './Parameter.module.css';

const valuesRender: {
	[parameterType: string]: ({
		className,
		style,
		value,
		onClick,
		onModalOpen,
	}: ParameterDisplayProps) => JSX.Element;
} = {
	[ParameterType.Toggle]: ParameterDisplayToggle,
};

function Parameter({
	className,
	style,
	type = ParameterType.Toggle,
	value,
	onClick,
	caption,
	onModalOpen = () => {},
	onResetClick = () => {},
	onChange = () => {},
	valuesList = [],
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
				<span>{caption}</span>
			</div>
			{workingWithData && (
				<ParameterAction
					workingWit={workingWit}
					value={value}
					onClick={onClick}
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
				/>
			</div>
		</div>
	);
}

export default Parameter;
