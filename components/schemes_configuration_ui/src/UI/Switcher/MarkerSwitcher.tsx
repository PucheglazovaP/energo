import React from 'react';
import clsx from 'clsx';

import { MarkerProps } from './types';

import './MarkerSwitcher.css';

function MarkerSwitcher(props: MarkerProps) {
	const { checked, className } = props;
	const markerSwitcherClassName = clsx([
		'marker__switcher',
		{ 'marker--checked': checked },
		className,
	]);

	return <span className={markerSwitcherClassName} />;
}

export default React.memo(MarkerSwitcher);
