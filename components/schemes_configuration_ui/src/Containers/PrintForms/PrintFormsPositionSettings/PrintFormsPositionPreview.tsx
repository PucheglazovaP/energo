import { CSSProperties } from 'react';

import { PrintFormTextAlign } from '../../../Shared/types';

import { JustifyContentDictionary } from './types';

import styles from './PrintFormsPositionSettings.module.css';

type PrintFormsPositionPreviewProps = {
	align: PrintFormTextAlign;
	isBold: boolean;
	color: string; // hex
	bgColor: string; // hex
	name?: string;
};

function PrintFormsPositionPreview(props: PrintFormsPositionPreviewProps) {
	const { align, isBold, color, bgColor, name } = props;

	const previewStyles: CSSProperties = {
		justifyContent: JustifyContentDictionary[align],
		fontWeight: isBold ? 'bold' : 'normal',
		color,
		backgroundColor: bgColor,
	};

	return (
		<div style={previewStyles} className={styles.preview}>
			{name ?? 'Наименование позиции'}
		</div>
	);
}

export default PrintFormsPositionPreview;
