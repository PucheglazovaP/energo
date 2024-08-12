import React from 'react';
import { Button } from '@evraz/ui-kit';

import RadioButton from '../../UI/RadioButton';
import { getBaseHour } from '../../Utils/getBaseHour';

import { useEditBaseHour } from './useEditBaseHour';

import styles from './EditBaseHour.module.css';

function EditBaseHour() {
	const { hour, handleSetHour, handleSubmitHour } = useEditBaseHour();
	const baseHours = Array(24).fill(0);
	return (
		<div>
			<div className={styles.radio_group}>
				{baseHours.map((_, i) => (
					<span key={getBaseHour(i)}>
						<RadioButton
							className={styles.radio}
							label={getBaseHour(i)}
							checked={hour === i}
							onChange={() => handleSetHour(i)}
						/>
					</span>
				))}
			</div>
			<Button className={styles.button} primary onClick={handleSubmitHour}>
				Применить
			</Button>
		</div>
	);
}

export default EditBaseHour;
