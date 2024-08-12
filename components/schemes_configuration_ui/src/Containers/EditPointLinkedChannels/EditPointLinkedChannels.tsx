import React from 'react';
import { Button } from '@evraz/ui-kit';

import { Plus } from '../../Icons';
import Table from '../../UI/Table';

import { useEditPointLinkedChannels } from './useEditPointLinkedChannels';

import styles from './EditPointLinkedChannels.module.css';

function EditPointLinkedChannels() {
	const { handleClose, handleOpenTree, header, data } =
		useEditPointLinkedChannels();
	return (
		<div>
			<section>
				<Button className={styles.button} onClick={handleOpenTree}>
					<Plus className={styles.icon} /> Добавить
				</Button>
			</section>
			<section className={styles.channels}>
				<Table className={styles.channels_table} headers={header} data={data} />
			</section>
			<div className={styles.controls}>
				<Button onClick={handleClose} primary>
					Завершить
				</Button>
			</div>
		</div>
	);
}

export default EditPointLinkedChannels;
