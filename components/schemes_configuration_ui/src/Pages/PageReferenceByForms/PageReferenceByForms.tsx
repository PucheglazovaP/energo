import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import { PrintFormsController } from '../../Containers/PrintForms/PrintFormsController';
import { PrintFormsList } from '../../Containers/PrintForms/PrintFormsList';
import { PrintFormsTable } from '../../Containers/PrintForms/PrintFormsTable';
import { ReferenceByFormsHeader } from '../../Containers/ReferenceByFormsHeader';
import { ReferenceByFormsHeaderRight } from '../../Containers/ReferenceByFormsHeaderRight';
import DoubleVerticalResizer from '../../UI/DoubleVerticalResizer';
import IndividualSidebar from '../../UI/IndividualSidebar';

import usePageReferenceByForms from './usePageReferenceByForms';

import styles from './PageReferenceByForms.module.css';

function renderTitleLeft() {
	return <ReferenceByFormsHeader title={'Справочник печатных форм'} />;
}
function renderTitleAside() {
	return <ReferenceByFormsHeaderRight />;
}

function PageReferenceByForms() {
	const {
		isLeftSidebarOpen,
		isRightSidebarOpen,
		leftElementMinWidth,
		rightElementMinWidth,
		leftElementDefaultWidth,
		rightElementDefaultWidth,
		leftElementMaxWidth,
		rightElementMaxWidth,
	} = usePageReferenceByForms();

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.panel}
				title={' '}
				renderTitleLeft={renderTitleLeft}
				renderTitleAside={renderTitleAside}
			>
				<div className={styles.body}>
					<DoubleVerticalResizer
						leftElementMinWidth={leftElementMinWidth}
						rightElementMinWidth={rightElementMinWidth}
						leftElementDefaultWidth={leftElementDefaultWidth}
						rightElementDefaultWidth={rightElementDefaultWidth}
						leftElementMaxWidth={leftElementMaxWidth}
						rightElementMaxWidth={rightElementMaxWidth}
					>
						<IndividualSidebar isOpen={isLeftSidebarOpen}>
							<div className={styles.forms}>
								<PrintFormsList title={'Печатные формы отчета'} />
							</div>
						</IndividualSidebar>
						<div className={styles.table}>
							<PrintFormsTable />
						</div>
						<IndividualSidebar isOpen={isRightSidebarOpen}>
							<div className={styles.settings}>
								<PrintFormsController />
							</div>
						</IndividualSidebar>
					</DoubleVerticalResizer>
				</div>
			</Panel>
		</main>
	);
}

export default PageReferenceByForms;
