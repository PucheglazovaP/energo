import { useState } from 'react';
import { Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import { PrintFormParameters } from '../PrintFormParameters';
import { PrintFormsPositionSettings } from '../PrintFormsPositionSettings';
import { PrintFormsTree } from '../PrintFormsTree';

import styles from './PrintFormsController.module.css';

enum PrintFormTabs {
	Tree = 'tree',
	Settings = 'settings',
	Parameters = 'parameters',
}

const items: SwitcherItemType[] = [
	{
		id: PrintFormTabs.Tree,
		title: 'Дерево',
	},
	{
		id: PrintFormTabs.Settings,
		title: 'Настройки',
	},
	{
		id: PrintFormTabs.Parameters,
		title: 'Параметры формы',
	},
];

function PrintFormsController() {
	const [selectedTabId, setSelectedTabId] = useState<PrintFormTabs>(
		PrintFormTabs.Tree,
	);

	const handleSelect = (id: string) => {
		setSelectedTabId(id as PrintFormTabs);
	};

	const renderController = () => {
		switch (selectedTabId) {
			case PrintFormTabs.Tree: {
				return <PrintFormsTree />;
			}
			case PrintFormTabs.Settings: {
				return <PrintFormsPositionSettings />;
			}
			case PrintFormTabs.Parameters: {
				return <PrintFormParameters />;
			}
		}
	};

	return (
		<div className={styles.controller}>
			<Switcher
				className={styles.switcher}
				items={items}
				selectedId={selectedTabId}
				onSelect={handleSelect}
			/>
			{renderController()}
		</div>
	);
}

export default PrintFormsController;
