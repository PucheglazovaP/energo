import React, { useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useEvent, useStore } from 'effector-react';

import AddTransparent from '../../Icons/AddTransparent';
import CheckMark from '../../Icons/CheckMark';
import MoreIcon from '../../Icons/More';
import Reference from '../../Icons/Reference';
import SelectingAllElements from '../../Icons/SelectingAllElements';
import { $editMode } from '../../Models/EditMode';
import {
	setCreateStatusIndicatorMode,
	setEditMode,
	setHighlightingBanners,
	setHintMode,
	setSelectingDynamicObjects,
} from '../../Models/EditMode/events';
import {
	resetSelection,
	setCreateDynamicObjectMode,
	setCreateTransparentMode,
} from '../../Models/EditMode/events';
import { disableEditMode } from '../../Models/FormSettings/events';
import {
	switchModalsBanners,
	switchModalsDynamicObject,
} from '../../Models/Modal/events';
import Checkbox from '../../UI/Checkbox';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';

import EditFormPanelProps from './types';

import styles from './EditFormPanel.module.css';

function EditFormPanel({ className }: EditFormPanelProps) {
	const enableCreateTransparentModeFx = useEvent(setCreateTransparentMode);
	const enableCreateDynamicObjectModeFx = useEvent(setCreateDynamicObjectMode);
	const resetSelectionFn = useEvent(resetSelection);
	const switchModalsBannersFn = useEvent(switchModalsBanners);
	const switchModalsDynamicObjectFn = useEvent(switchModalsDynamicObject);
	const setHighlightingBannersFn = useEvent(setHighlightingBanners);
	const setSelectingDynamicObjectsFn = useEvent(setSelectingDynamicObjects);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const {
		isCreateTransparentModeEnabled,
		isHintModeEnabled,
		isCreateDynamicObjectModeEnabled,
		isCreateStatusIndicatorEnabled,
	} = useStore($editMode);
	const openBannerInformation = () => {
		switchModalsBannersFn();
	};
	const openDynamicObject = () => {
		switchModalsDynamicObjectFn();
	};
	const handleHintModeChange = () => {
		setHintMode(!isHintModeEnabled);
	};

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: '',
			withSeparator: true,
			separatorName: 'Отображение данных',
			renderFn: () => null,
		},
		{
			onClick: handleHintModeChange,
			name: 'Скрыть подсказки',
			renderFn: () => (
				<span className={styles.menu_item}>
					<Checkbox
						name={'hint'}
						title="Скрыть подсказки"
						checked={!isHintModeEnabled}
						onChange={handleHintModeChange}
						className={styles.checkbox}
					/>
				</span>
			),
		},
	];
	const handleCreateTransparentClick = () => {
		resetSelectionFn();
		if (!isCreateStatusIndicatorEnabled && !isCreateDynamicObjectModeEnabled) {
			enableCreateTransparentModeFx();
		}
	};
	const handleCreateStatusIndicatorClick = () => {
		resetSelectionFn();
		if (!isCreateTransparentModeEnabled && !isCreateDynamicObjectModeEnabled) {
			setCreateStatusIndicatorMode();
		}
	};

	const handleCreateDynamicObjectClick = () => {
		resetSelectionFn();
		if (!isCreateTransparentModeEnabled && !isCreateStatusIndicatorEnabled) {
			enableCreateDynamicObjectModeFx();
		}
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
	};

	// выделение объектов

	const highlightingAllBanners = () => {
		setHighlightingBannersFn();
	};
	const selectingAllDynamicObjects = () => {
		setSelectingDynamicObjectsFn();
	};

	return (
		<div className={clsx(styles.root, className)}>
			<Button
				className={clsx(
					styles.btn_add,
					isCreateTransparentModeEnabled && styles.active_button,
				)}
				onClick={handleCreateTransparentClick}
			>
				<AddTransparent className={styles.btn_add_icon} />
				<p>Транспарант</p>
			</Button>
			<button
				className={styles.btn_selecting_elements}
				onClick={highlightingAllBanners}
			>
				<SelectingAllElements className={styles.selecting_elements_icon} />
			</button>
			<button
				className={styles.btn_show_all_banners}
				onClick={openBannerInformation}
			>
				<Reference className={styles.show_all_banners_icon} />
			</button>
			<div className={styles.vertical_line}></div>
			<Button
				className={clsx(
					styles.btn_add,
					isCreateDynamicObjectModeEnabled && styles.active_button,
				)}
				onClick={handleCreateDynamicObjectClick}
			>
				<AddTransparent className={styles.btn_add_icon} />
				<p>Динамический объект</p>
			</Button>
			<button
				className={styles.btn_selecting_elements}
				onClick={selectingAllDynamicObjects}
			>
				<SelectingAllElements className={styles.selecting_elements_icon} />
			</button>
			<button
				className={styles.btn_show_all_banners}
				onClick={openDynamicObject}
			>
				<Reference className={styles.show_all_banners_icon} />
			</button>
			<div className={styles.vertical_line}></div>
			<Button
				className={clsx(
					styles.btn_add,
					isCreateStatusIndicatorEnabled && styles.active_button,
				)}
				onClick={handleCreateStatusIndicatorClick}
			>
				<AddTransparent className={styles.btn_add_icon} />
				<p>Индикатор состояния</p>
			</Button>
			<Button className={styles.btn_add}>
				<AddTransparent className={styles.btn_add_icon} />
				<p>Таблица</p>
			</Button>
			<div className={styles.vertical_line}></div>
			<Button
				className={styles.close}
				onClick={() => {
					setEditMode(false);
					disableEditMode();
				}}
			>
				<CheckMark />
				<p>Завершить</p>
			</Button>
			<Button className={styles.menu_btn} onClick={handleContextMenu}>
				<MoreIcon />
			</Button>
			{position && (
				<ContextMenu
					items={contextMenuItems}
					position={position}
					setPosition={setPosition}
					className={styles.menu}
				/>
			)}
		</div>
	);
}

export default EditFormPanel;
