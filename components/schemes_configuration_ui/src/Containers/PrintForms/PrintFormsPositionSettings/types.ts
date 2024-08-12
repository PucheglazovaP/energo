import { CSSProperties } from 'react';

import { PrintFormTextAlign } from '../../../Shared/types';

export const PriorityDictionary: Record<number, string> = {
	0: 'Суточный архив',
	1: 'Канал мониторинга энергоресурсов',
};

export const JustifyContentDictionary: Record<
	PrintFormTextAlign,
	CSSProperties['justifyContent']
> = {
	[PrintFormTextAlign.Left]: 'flex-start',
	[PrintFormTextAlign.Center]: 'center',
	[PrintFormTextAlign.Right]: 'flex-end',
};

export type ListInformationItem = {
	title: string;
	value?: string;
};
