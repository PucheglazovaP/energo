import { Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import { changeDiagnosticType } from '../../../Models/DiagnosticType/events';
import { DiagnosticType } from '../../../Shared/types';

import { DiagnosticControlTypeSwitcherProps } from './types';

import styles from './DiagnosticControlBar.module.css';

const items: SwitcherItemType[] = [
	{
		id: DiagnosticType.Device,
		title: 'Текущее состояние',
	},
	{
		id: DiagnosticType.Channel,
		title: 'Поканальная диагностика',
	},
];

function DiagnosticControlTypeSwitcher(
	props: DiagnosticControlTypeSwitcherProps,
) {
	const { type } = props;
	const handleSelect = (id: string) => {
		changeDiagnosticType(id as DiagnosticType);
	};

	return (
		<Switcher
			className={styles.select_type}
			items={items}
			onSelect={handleSelect}
			selectedId={type}
		/>
	);
}

export default DiagnosticControlTypeSwitcher;
