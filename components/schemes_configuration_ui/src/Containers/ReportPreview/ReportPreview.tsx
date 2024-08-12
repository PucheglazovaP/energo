import { ReportPreviewProps } from './types';

import styles from './ReportPreview.module.css';

function ReportPreview({ className, url }: ReportPreviewProps) {
	return (
		<div className={`${styles.container} ${className || ''}`}>
			<iframe title="Превью отчета" src={url} />
		</div>
	);
}
export default ReportPreview;
