import { Switcher } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { setSelectedSwitcherItemEvent } from '../../../Models/DiagnosticCurrent/events';
import { ServersFavoritesSwitcher } from '../../../Models/DiagnosticCurrent/types';

import { switcherItems } from './constants';

import styles from './DiagnosticControlBar.module.css';

function DiagnosticControlSwitcher() {
	const { selectedSwitcherItem } = useStore($diagnosticCurrentModel);

	const handleSwitcherChange = (value: string) => {
		setSelectedSwitcherItemEvent(value as ServersFavoritesSwitcher);
	};

	return (
		<Switcher
			className={styles.switcher}
			items={switcherItems}
			selectedId={selectedSwitcherItem}
			onSelect={handleSwitcherChange}
		/>
	);
}

export default DiagnosticControlSwitcher;
