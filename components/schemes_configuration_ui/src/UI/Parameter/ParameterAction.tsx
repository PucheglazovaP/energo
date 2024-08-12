import { useCallback, useEffect, useState } from 'react';
import { useId } from 'react';
import { toast } from 'react-toastify';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import CopyIcon from '../../Icons/Copy';
import { TooltipDirection } from '../../Shared/types';

import { IconApprove, IconReject } from './iconEditing';

import styles from './Parameter.module.css';
function ParameterAction({ workingWit, value, onClick, isHintEnabled }: any) {
	function setWorkingWithData() {
		workingWit(false);
	}
	const [inputValue, setValue] = useState(value);
	const id = useId();

	const saveValue = useCallback(() => {
		setWorkingWithData();
		onClick(inputValue);
	}, [inputValue]);

	const onKeyPress = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				saveValue();
			}
		},
		[saveValue],
	);

	const copyValue = () => {
		navigator.clipboard.writeText(value || '').then(() => {
			toast.success('Скопировано');
		});
	};

	useEffect(() => {
		window.addEventListener('keydown', onKeyPress);

		return () => {
			window.removeEventListener('keydown', onKeyPress);
		};
	}, [onKeyPress]);
	return (
		<div className={clsx(styles.paramp_action)}>
			<input
				className={clsx(styles.paramp_action_input)}
				value={inputValue}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
			<button onClick={saveValue} className={clsx(styles.paramp_action_button)}>
				<IconApprove />
			</button>
			<button
				onClick={setWorkingWithData}
				className={clsx(styles.paramp_action_button)}
			>
				<IconReject />
			</button>
			{value !== 'null' && (
				<Tooltip
					tooltip="Копировать"
					forceDirection={TooltipDirection.Down}
					className={styles.tooltip}
					disabled={!isHintEnabled}
				>
					<button
						key={id}
						onClick={copyValue}
						className={clsx(styles.param_condition_reset)}
					>
						<CopyIcon />
					</button>
				</Tooltip>
			)}
		</div>
	);
}

export default ParameterAction;
