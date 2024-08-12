import React from 'react';
import { BasketFirst, Button } from '@evraz/ui-kit';

import Edit from '../../Icons/Edit';

import { HeatingSeasonButtonsProps } from './types';

import styles from './HeatingSeasons.module.css';

export function HeatingSeasonButtons({
	onHeatingSeasonUpdate,
	onHeatingSeasonDelete,
}: HeatingSeasonButtonsProps) {
	return (
		<div className={styles.buttons_container}>
			<Button
				className={styles.button}
				onClick={onHeatingSeasonUpdate}
				title={'Редактировать'}
			>
				<Edit className={styles.icon} />
			</Button>
			<Button
				className={styles.button}
				onClick={onHeatingSeasonDelete}
				title={'Удалить'}
			>
				<BasketFirst className={styles.icon} />
			</Button>
		</div>
	);
}
