import { ArrowRepeat } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Bin, Edit, Plus } from '../../Icons';
import LinkOn from '../../Icons/LinkOn';
import { ContextMenuItem } from '../../UI/ContextMenu/types';

import {
	handleOpenChangeChannelEquipmentNodeModal,
	handleOpenCreateNodeModal,
	handleOpenDeleteNodeModal,
	handleOpenEditNodeModal,
	handleOpenUnlinkEquipmentModal,
} from './utils';

import styles from './PageNSI.module.css';

export const nodeTypesForContextMenu: string[] = [
	'device',
	'node',
	'nsi_channel',
	'equipment_piece',
];

export const addNodeContextMenuItem: ContextMenuItem = {
	name: 'Добавить узел учета',
	onClick: handleOpenCreateNodeModal,
	renderFn: () => (
		<div className={'context_menu_item'}>
			<Plus className={'context_menu_icon'} />
			<span>Узел учета</span>
		</div>
	),
};
export const editNodeContextMenuItem: ContextMenuItem = {
	name: 'Редактировать узел учета',
	onClick: handleOpenEditNodeModal,
	renderFn: () => (
		<div className={'context_menu_item'}>
			<Edit className={'context_menu_icon'} />
			<span>Редактировать</span>
		</div>
	),
};
export const deleteNodeContextMenuItem: ContextMenuItem = {
	name: 'Удалить узел учета',
	onClick: handleOpenDeleteNodeModal,
	renderFn: () => (
		<div className={'context_menu_item'}>
			<Bin className={'context_menu_icon'} />
			<span>Удалить</span>
		</div>
	),
};
export const changeChannelEquipmentNodeContextMenuItem: ContextMenuItem = {
	name: 'Сменить узел учета',
	onClick: handleOpenChangeChannelEquipmentNodeModal,
	renderFn: () => (
		<div className={'context_menu_item'}>
			<ArrowRepeat
				className={clsx('context_menu_icon', styles.context_menu_icon)}
			/>
			<span>Сменить узел учета</span>
		</div>
	),
};

export const unlinkEquipmentContextMenuItem: ContextMenuItem = {
	name: 'Отвязать',
	onClick: handleOpenUnlinkEquipmentModal,
	renderFn: () => (
		<div className={'context_menu_item'}>
			<LinkOn className={'context_menu_icon'} />
			<span>Отвязать</span>
		</div>
	),
};
