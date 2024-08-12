import React from 'react';
import { Button } from '@evraz/ui-kit';

import Edit from '../../Icons/Edit';
import File from '../../Icons/File';
import Divider from '../../UI/Divider';

import { DevicesHeaderButtonsProps } from './types';

import styles from './DeviceReports.module.css';

function DeviceReportsHeaderButtons({
	onDeviceEdit,
	onGenerateReport,
}: DevicesHeaderButtonsProps) {
	return (
		<div className={styles.header_buttons}>
			<>
				<Button onClick={onDeviceEdit} className={styles.header_button}>
					<Edit className={styles.icon_edit} />
					<span>Редактировать</span>
				</Button>
				<Divider />
				<Button onClick={onGenerateReport} className={styles.header_button}>
					<File className={styles.icon_edit} />
					<span>Сформировать отчет</span>
				</Button>
			</>
		</div>
	);
}

export default DeviceReportsHeaderButtons;
