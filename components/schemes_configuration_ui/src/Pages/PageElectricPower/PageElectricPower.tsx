import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import ReportPreview from '../../Containers/ReportPreview/ReportPreview';

import usePageElectricPower from './usePageElectricPower';

import styles from './PageElectricPower.module.css';

function PageElectricPower() {
	const { url } = usePageElectricPower();

	return (
		<main className={clsx('page', styles.root)}>
			<Panel className={styles.common} title={'Электроэнергия'}>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageElectricPower;
