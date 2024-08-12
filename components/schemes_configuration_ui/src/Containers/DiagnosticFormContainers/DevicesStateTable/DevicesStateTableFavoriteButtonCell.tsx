import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import Bookmark from '../../../Icons/Bookmark';
import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { toggleBooleanStorageEvent } from '../../../Models/DiagnosticCurrent/events';
import { StorageFieldName } from '../../../Models/DiagnosticCurrent/types';

import { DevicesStateTableFavoriteButtonCellProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableFavoriteButtonCell({
	data,
}: DevicesStateTableFavoriteButtonCellProps) {
	const { devicesFavoriteStorage } = useStore($diagnosticCurrentModel);
	const { deviceId = '' } = data;

	const handleFavoriteChange = () => {
		toggleBooleanStorageEvent({
			storageFieldName: StorageFieldName.DevicesFavoriteStorage,
			dictionaryKey: deviceId,
		});
	};

	return (
		<div className={styles.devices_favorite_button_cell}>
			<Button
				onClick={handleFavoriteChange}
				className={clsx(styles.devices_favorite_button, {
					[styles.devices_favorite_button__active]:
						devicesFavoriteStorage[deviceId],
				})}
			>
				<Bookmark />
			</Button>
		</div>
	);
}

export default DevicesStateTableFavoriteButtonCell;
