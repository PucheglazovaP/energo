import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import {
	HeaderParameterType,
	InputFormHeader,
} from '../../../Models/InputFormHeader/types';

import styles from '../InputFormTable.module.css';

function InputCell({
	cellStyles,
	headerItem,
	methodName,
	cellText,
	onClick,
	additionalCellStyles,
	additionalCellText,
}: {
	cellStyles: React.CSSProperties;
	additionalCellStyles?: React.CSSProperties;
	additionalCellText?: string | number;
	headerItem: InputFormHeader;
	methodName: string;
	cellText: string | number;
	onClick: () => void;
}): JSX.Element {
	if (!String(cellText)) {
		return <div />;
	}
	if (headerItem.type === HeaderParameterType.Method && methodName) {
		return (
			<span className={styles.method} title={methodName}>
				{methodName}
			</span>
		);
	}
	if (headerItem.name === 'baseCCN') {
		return (
			<Button onClick={onClick} className={styles.link}>
				{cellText}
			</Button>
		);
	}
	if (additionalCellText) {
		return (
			<div className={clsx(styles.table_text)}>
				<span
					className={clsx(styles.table_text)}
					style={cellStyles}
					title={String(cellText)}
				>
					{typeof cellText === 'number' ? cellText.toLocaleString() : cellText}
				</span>
				<span
					className={clsx(styles.table_text)}
					style={additionalCellStyles}
					title={String(additionalCellText)}
				>
					{typeof cellText === 'number'
						? additionalCellText.toLocaleString()
						: additionalCellText}
				</span>
			</div>
		);
	}
	return (
		<div className={clsx(styles.table_text)}>
			<span
				className={clsx(styles.table_text)}
				style={cellStyles}
				title={String(cellText)}
			>
				{typeof cellText === 'number' ? cellText.toLocaleString() : cellText}
			</span>
		</div>
	);
}

export default InputCell;
