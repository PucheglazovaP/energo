import React from 'react';
import { Button } from '@evraz/ui-kit';

import { Plus } from '../../Icons';
import Table from '../../UI/Table';

import { HeatingSeasonsBodyProps } from './types';

import styles from './HeatingSeasons.module.css';

export function HeatingSeasonsBody({
	tableBody,
	tableHeader,
	onHeatingSeasonAdd,
}: HeatingSeasonsBodyProps) {
	return (
		<div className={styles.heating_seasons_body}>
			<Table headers={tableHeader} data={tableBody} className={styles.table} />
			<div className={styles.add_season_button_container}>
				<Button
					className={styles.add_season_button}
					onClick={onHeatingSeasonAdd}
				>
					<Plus />
					<span>Новый сезон</span>
				</Button>
			</div>
		</div>
	);
}
