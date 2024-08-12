import React from 'react';
import { Button } from '@evraz/ui-kit';

import Refresh from '../../Icons/Refresh';
import Divider from '../../UI/Divider';

import { HeatingSeasonsHeaderProps } from './types';

import styles from './HeatingSeasons.module.css';

export function HeatingSeasonsHeader({
	onGetHeatingSeasons,
}: HeatingSeasonsHeaderProps) {
	return (
		<div className={styles.heating_seasons_header}>
			<h3>Отопительный сезон</h3>
			<div className={styles.header_buttons}>
				<Divider />
				<Button className={styles.header_button} onClick={onGetHeatingSeasons}>
					<Refresh className={styles.icon_refresh} />
					<span>Обновить</span>
				</Button>
			</div>
		</div>
	);
}
