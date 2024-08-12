/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Close } from '../../Icons';
import CopyIcon from '../../Icons/Copy';
import AddIcon from '../../Icons/Plus';
import WidgetIcon from '../../Icons/Widget';
import { $user } from '../../Models/Auth';
import { $formTabs } from '../../Models/FormTabs';
import {
	addTab,
	changeTab,
	copyTab,
	deleteTab,
} from '../../Models/FormTabs/events';
import { setWidgetData, setWidgetOpen } from '../../Models/Widget/events';
import { FormTypes, TooltipDirection } from '../../Shared/types';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';

import FormTabsProps from './types';

import styles from './FormTabs.module.css';

function FormTabs({ className }: FormTabsProps) {
	const { formTabs, selectedVersion } = useStore($formTabs);
	const user = useStore($user);
	const [activeTabId, setTabId] = useState<string>();

	const filteredTabs = useMemo(
		() => formTabs.get(selectedVersion) || [],
		[formTabs, selectedVersion],
	);

	const handleCopyTab = useCallback(() => {
		if (!user) return;
		if (activeTabId != null)
			copyTab({
				tabId: activeTabId,
				versionCode: selectedVersion,
				userId: user.preferredUsername,
			});
	}, [activeTabId, selectedVersion, user]);

	const handleOpenWidget = useCallback(() => {
		if (activeTabId != null) {
			const activeTab = filteredTabs.find((item) => item.tabId === activeTabId);
			if (activeTab) setWidgetData(activeTab);
			setWidgetOpen(true);
		}
	}, [activeTabId, filteredTabs]);

	const contextMenuItems: ContextMenuItem[] = useMemo(() => {
		const selectedTab = filteredTabs.find((item) => item.tabId === activeTabId);
		return [
			{
				name: 'Открыть виджет',
				onClick: handleOpenWidget,
				isDisabled:
					selectedTab?.formType !== FormTypes.Chart &&
					selectedTab?.formType !== FormTypes.MultiChart,
				renderFn: () => (
					<span className={styles.menu_item}>
						<WidgetIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Открыть виджет</span>
					</span>
				),
			},
			{
				name: 'Дублировать вкладку',
				onClick: handleCopyTab,
				/* isDisabled: isLoading, */
				renderFn: () => (
					<span className={styles.menu_item}>
						<CopyIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Дублировать вкладку</span>
					</span>
				),
			},
		];
	}, [activeTabId, filteredTabs, handleCopyTab, handleOpenWidget]);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleContextMenu = (
		evt: React.MouseEvent<HTMLButtonElement>,
		tabId: string,
	) => {
		evt.preventDefault();
		evt.stopPropagation();
		setPosition({ x: evt.pageX, y: evt.pageY });
		setTabId(tabId);
	};
	const handleAddTab = useCallback(() => {
		if (!user) return;
		addTab({
			versionCode: selectedVersion,
			url: '',
			userId: user.preferredUsername,
		});
	}, [selectedVersion, user]);
	const handleDeleteTab = useCallback(
		(tabId: string) => {
			if (!user) return;
			if (filteredTabs.length > 1 && tabId)
				deleteTab({
					tabId,
					versionCode: selectedVersion,
					userId: user.preferredUsername,
				});
		},
		[filteredTabs, selectedVersion, user],
	);
	const handleChangeTab = useCallback(
		(tabId: string) => {
			if (!user) return;
			changeTab({
				tabId,
				versionCode: selectedVersion,
				userId: user.preferredUsername,
			});
		},
		[selectedVersion, formTabs, user],
	);

	return (
		<>
			{filteredTabs.length > 0 && (
				<div
					className={clsx(styles.root, className)}
					onContextMenu={(event) => event.preventDefault()}
				>
					{filteredTabs.map((item, index) => (
						<Tooltip
							tooltip={item.title}
							direction={TooltipDirection.Down}
							key={`${selectedVersion}-${item.formId}-${index}`}
							className={styles.tooltip}
						>
							<div
								key={`${selectedVersion}-${item.formId}-${index}`}
								className={clsx(styles.item, item.isSelected && styles.active)}
							>
								<Button
									id={`${selectedVersion}-${item.formId}`}
									onClick={() => handleChangeTab(item.tabId)}
									className={styles.btn}
									onContextMenu={(evt) =>
										item.tabId && handleContextMenu(evt, item.tabId)
									}
								>
									{item.title}
								</Button>
								<Button
									onClick={() => {
										handleDeleteTab(item.tabId);
									}}
									className={styles.close_btn}
								>
									<Close className={styles.icon} />
								</Button>
							</div>
						</Tooltip>
					))}
					<Tooltip
						tooltip="Новая закладка"
						direction={TooltipDirection.Down}
						className={styles.tooltip}
					>
						<Button
							onClick={handleAddTab}
							className={styles.add_tab}
							disabled={filteredTabs.length > 20}
							key="new-tab"
						>
							<AddIcon className={styles.add_icon} />
						</Button>
					</Tooltip>
				</div>
			)}
			{position && (
				<ContextMenu
					items={contextMenuItems}
					position={position}
					setPosition={setPosition}
					className={styles.menu}
				/>
			)}
		</>
	);
}

export default FormTabs;
