import { Button } from '@evraz/ui-kit';

import { Path } from '../../Shared/types';
import { Cell } from '../../UI/Table/types';

import styles from './DevicesGroupsArchive.module.css';

export function NameCell(props: Cell) {
	const { text, number } = props;
	const handleClick = () => {
		window.open(
			`${window.location.origin}/schemes/#${Path.ReportByDevices}?deviceId=${number}`,
			'_blank',
			'noreferrer',
		);
	};
	return (
		<Button className={styles.link} onClick={handleClick}>
			{text}
		</Button>
	);
}
