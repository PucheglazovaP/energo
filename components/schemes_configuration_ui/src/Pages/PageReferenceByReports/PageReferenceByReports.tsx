import { Button, Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import ReportItemsList from '../../Containers/ReportItemsList';
import ReportsSection from '../../Containers/ReportsSection';
import { IconLayerSidebar } from '../../UI/Icon';
import VerticalResizer from '../../UI/VerticalResizer';

import usePageReferenceByReports from './usePageReferenceByReports';

import styles from './PageReferenceByReports.module.css';

function PageReferenceByReports() {
	const { currentReport, isOpen, handleToggleIsOpenSidePanel } =
		usePageReferenceByReports();

	function renderReferenceByReportsTitle() {
		return (
			<div className={styles.top_section}>
				<Button
					className={clsx('icon_button', styles.sidebar_btn)}
					onClick={handleToggleIsOpenSidePanel}
				>
					<IconLayerSidebar />
				</Button>
				<div className={styles.title}>
					<h2 className="scheme_title">{'Справочник отчетов за период'}</h2>
					{currentReport && <h3>&nbsp;{`/ ${currentReport.name}`}</h3>}
				</div>
			</div>
		);
	}

	return (
		<main className={clsx('page', styles.container)}>
			<Panel
				className={styles.panel}
				title={' '}
				renderTitleLeft={renderReferenceByReportsTitle}
			>
				<VerticalResizer
					firstElementMinWidth={320}
					secondElementMinWidth={1000}
					leftElementWidth={isOpen ? 20 : 0}
				>
					{isOpen && <ReportsSection />}
					<ReportItemsList />
				</VerticalResizer>
			</Panel>
		</main>
	);
}

export default PageReferenceByReports;
