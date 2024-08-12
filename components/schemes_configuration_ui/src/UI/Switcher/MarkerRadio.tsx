import React from 'react';
import clsx from 'clsx';

import { MarkerProps } from './types';

import './MarkerRadio.css';

function MarkerRadio(props: MarkerProps) {
	const { checked, className } = props;
	const markerRadioClassName = clsx([
		'marker__radio',
		{ 'marker--checked': checked },
		className,
	]);

	return <span className={markerRadioClassName} />;
}

export default React.memo(MarkerRadio);
