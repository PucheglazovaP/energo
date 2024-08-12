import { ReactElement } from 'react';

import { DiagnosticType } from '../../../Shared/types';
export type SwitcherItemRenderFn = {
	id: string;
	title: string | ReactElement;
	isSelected: boolean;
	isDisabled: boolean;
	onSelect: (id: string) => void;
};

export type DiagnosticControlTypeSwitcherProps = {
	type: DiagnosticType;
};

export default {};
