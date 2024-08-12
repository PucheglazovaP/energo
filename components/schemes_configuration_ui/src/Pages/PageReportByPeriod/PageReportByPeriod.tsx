import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ReferenceByFormsHeader } from '../../Containers/ReferenceByFormsHeader';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';

import usePageReportByPeriod from './usePageReportByPeriod';

import styles from './PageReportByPeriod.module.css';

function renderTitle() {
	return (
		<ReferenceByFormsHeader
			title={'Отчеты за период'}
			needRenderSidebarToggle={false}
		/>
	);
}
function PageReportByPeriod() {
	const { selectedReport, reportUrl } = usePageReportByPeriod();

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={renderTitle}
			>
				<div className={styles.container}>
					{selectedReport && <ReportPreview url={reportUrl} />}
				</div>
			</Panel>
		</main>
	);
}

export default PageReportByPeriod;
