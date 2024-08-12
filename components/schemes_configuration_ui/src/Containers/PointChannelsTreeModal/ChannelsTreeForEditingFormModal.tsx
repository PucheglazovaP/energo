import React from 'react';
import { Button, Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import { TreeTypes } from '../../Shared/types';

import PointDevicesTree from './PointDevicesTree';
import PointUnconnectedChannelsTree from './PointUnconnectedChannelsTree';
import { useChannelsTreeForEditingFormModal } from './useChannelsTreeForEditingFormModal';

import styles from './PointChannelsTreeModal.module.css';

const treeSwitcher: SwitcherItemType[] = [
	{
		id: TreeTypes.Devices,
		title: 'Приборы и каналы',
	},
	{
		id: TreeTypes.Channels,
		title: 'Без привязки к прибору',
	},
];

function ChannelsTreeForEditingFormModal() {
	const {
		handleClose,
		selectedType,
		setSelectedType,
		channelId,
		handleSubmit,
	} = useChannelsTreeForEditingFormModal();
	return (
		<div className={styles.tree_modal}>
			<Switcher
				items={treeSwitcher}
				selectedId={selectedType}
				onSelect={(id: string) => setSelectedType(id as TreeTypes)}
				className={styles.switcher_type}
			/>
			{selectedType === TreeTypes.Devices ? (
				<PointDevicesTree />
			) : (
				<PointUnconnectedChannelsTree />
			)}
			<div className={styles.controls}>
				<Button onClick={handleClose}>Отменить</Button>
				<Button disabled={!channelId} onClick={handleSubmit} primary>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default ChannelsTreeForEditingFormModal;
