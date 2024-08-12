import React, { ChangeEventHandler } from 'react';

import styles from './CheckBox.module.scss';
type CheckBoxPropsType = {
	id: string;
	isChecked: boolean;
	setChecked: ChangeEventHandler<HTMLInputElement>;
};

function CheckBox({ id, isChecked, setChecked }: CheckBoxPropsType) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			className={styles.checkbox}
			onClick={(event) => {
				event.stopPropagation();
			}}
		>
			<input
				type="checkbox"
				id={id}
				onChange={setChecked}
				checked={isChecked}
			/>
			<label htmlFor={id}>{''}</label>
		</div>
	);
}

export default CheckBox;
