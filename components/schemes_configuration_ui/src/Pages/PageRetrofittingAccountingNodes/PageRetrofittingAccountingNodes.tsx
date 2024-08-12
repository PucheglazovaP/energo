import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import ReportPreview from '../../Containers/ReportPreview';
import { Permissions } from '../../packages/KeycloakInstance/types';
import { Authenticated } from '../../UI/Authenticated';

import usePageRetrofittingAccountingNodes from './usePageRetrofittingAccountingNodes';

import styles from './PageRetrofittingAccountingNodes.module.css';

function PageRetrofittingAccountingNodes() {
	const { url } = usePageRetrofittingAccountingNodes();

	function renderRetrofittingAccountingNodes() {
		return (
			<div className={styles.top_section}>
				<h2 className="scheme_title">{'Дооснащение узлами учёта'}</h2>
			</div>
		);
	}

	return (
		<div className={clsx('page', styles.root)}>
			<Authenticated allowed={Permissions.CanAccessRetrofittingAccountingNodes}>
				<Panel
					className={styles.common}
					title={' '}
					renderTitleLeft={renderRetrofittingAccountingNodes}
				>
					<ReportPreview url={url} />
				</Panel>
			</Authenticated>
		</div>
	);
}

export default PageRetrofittingAccountingNodes;
