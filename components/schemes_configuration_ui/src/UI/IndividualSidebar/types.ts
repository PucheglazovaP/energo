import React, { ReactNode } from 'react';

export interface IndividualSidebarProps {
	isOpen: boolean;
	children: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}
