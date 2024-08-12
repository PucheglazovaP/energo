import React from 'react';
import { Tooltip } from '@evraz/ui-kit';

import Info from '../../Icons/Info';
import { TooltipDirection } from '../../Shared/types';
import { formatToDefaultDisplayFormat } from '../../Utils/dateUtils';

import { HeatingSeasonInfoItemProps } from './types';

import styles from './HeatingSeasons.module.css';

function TooltipBody({
	creationDate,
	createdBy,
	modifications,
}: HeatingSeasonInfoItemProps) {
	return (
		<div className={styles.tooltip_body}>
			<h4>Добавление</h4>
			<p>
				<span>{formatToDefaultDisplayFormat(creationDate)}</span>
				<span>{createdBy}</span>
			</p>

			<h4>Редактирование</h4>
			{modifications.map((modification) => (
				<p key={modification.modifiedDate}>
					<span>{formatToDefaultDisplayFormat(modification.modifiedDate)}</span>
					<span>{modification.modifiedBy}</span>
				</p>
			))}
		</div>
	);
}
export function HeatingSeasonInfoItem({
	creationDate,
	createdBy,
	modifications,
}: HeatingSeasonInfoItemProps) {
	return (
		<div className={styles.tooltip_container}>
			<Tooltip
				direction={TooltipDirection.Down}
				tooltip={
					<TooltipBody
						creationDate={creationDate}
						createdBy={createdBy}
						modifications={modifications}
					/>
				}
				className={styles.tooltip}
			>
				<div className={styles.icon_info_container} key={creationDate}>
					<Info className={styles.icon_info} />
				</div>
			</Tooltip>
		</div>
	);
}
