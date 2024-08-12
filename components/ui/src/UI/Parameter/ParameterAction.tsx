import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { IconApprove, IconReject } from './iconEditing';

import styles from './Parameter.module.css';

function ParameterAction({ workingWit, value, onClick }: any) {
	function setWorkingWithData() {
		workingWit(false);
	}
	const [inputValue, setValue] = useState(value);
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
		</div>
	);
}

export default ParameterAction;
