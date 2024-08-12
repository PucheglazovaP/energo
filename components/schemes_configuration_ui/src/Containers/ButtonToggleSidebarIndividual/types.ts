import React from 'react';
export interface ButtonToggleSidebarIndividualProps {
	isSidebarOpen: boolean;
	onClick: () => void;
	className?: string;
	style?: React.CSSProperties;
}
