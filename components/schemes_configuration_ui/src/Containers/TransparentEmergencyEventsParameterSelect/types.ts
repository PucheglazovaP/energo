import React from 'react';
export interface Props {
	className?: string;
	style?: React.CSSProperties;
	onConfirm: (
		treeItemId: number,
		displayName: string,
		parameterCode: number,
		versionCode: number,
		objectId: number,
	) => void;
}
