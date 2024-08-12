import { Panel } from '@evraz/ui-kit';

import { PrintFormsList } from '../../Containers/PrintForms/PrintFormsList';
import { ReferenceByFormsHeader } from '../../Containers/ReferenceByFormsHeader';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import { setSelectedPrintFormId } from '../../Models/PrintForms/events';
import VerticalResizer from '../../UI/VerticalResizer';

import usePageReportByPrintForms from './usePageReportByPrintForms';

import styles from './PageReportByPrintForms.module.css';

function renderTitle() {
	return (
		<ReferenceByFormsHeader
			title={'Печатные формы'}
			onSelectDropdown={() => {
				setSelectedPrintFormId(0);
			}}
			needRenderSidebarToggle={false}
		/>
	);
}

function PageReportByPrintForms() {
	const { reportUrl, selectedPrintFormId } = usePageReportByPrintForms();

	return (
		<Panel className={styles.panel} title={' '} renderTitleLeft={renderTitle}>
			<VerticalResizer firstElementMinWidth={280} secondElementMinWidth={1000}>
				<PrintFormsList title={'Список печатных форм'} isViewMode />
				{!!selectedPrintFormId && <ReportPreview url={reportUrl} />}
			</VerticalResizer>
		</Panel>
	);
}

export default PageReportByPrintForms;
