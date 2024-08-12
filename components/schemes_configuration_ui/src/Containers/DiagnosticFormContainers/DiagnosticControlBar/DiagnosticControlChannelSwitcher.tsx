import { Select } from '@evraz/ui-kit';
import { Option } from '@evraz/ui-kit/dist/src/components/Select/types';
import { useStore } from 'effector-react';

import { $channelsDiagnostic } from '../../../Models/ChannelDiagnostic';
import { changeInterval } from '../../../Models/ChannelDiagnostic/events';

import styles from './DiagnosticControlBar.module.css';

const options: Option[] = [
	{
		id: '0',
		name: '0 мин',
	},
	{
		id: '1',
		name: '1 мин',
	},
	{
		id: '5',
		name: '5 мин',
	},
	{
		id: '15',
		name: '15 мин',
	},
	{
		id: '30',
		name: '30 мин',
	},
	{
		id: '60',
		name: '1 час',
	},
	{
		id: '480',
		name: '8 часов',
	},
	{
		id: '1440',
		name: '1 сутки',
	},
	{
		id: '2880',
		name: '2 суток',
	},
	{
		id: '4320',
		name: '3 суток',
	},
];

function DiagnosticControlChannelSwitcher() {
	const { interval } = useStore($channelsDiagnostic);

	const handleChange = (option: Option) => {
		changeInterval(Number(option.id));
	};

	return (
		<Select
			className={styles.select_interval}
			options={options}
			onChange={handleChange}
			type="contained"
			value={String(interval)}
		/>
	);
}

export default DiagnosticControlChannelSwitcher;
