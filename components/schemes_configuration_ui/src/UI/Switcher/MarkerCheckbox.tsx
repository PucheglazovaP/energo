import React from 'react';
import clsx from 'clsx';

import Glyph from '../Glyph';

import { MarkerProps } from './types';

import './MarkerCheckbox.css';

function MarkerCheckbox(props: MarkerProps) {
	const { checked, className } = props;
	const markerCheckboxClassName = clsx([
		'marker__checkbox',
		{ 'marker--checked': checked },
		className,
	]);

	return (
		<span className={markerCheckboxClassName}>
			<Glyph name="Checkmark" className="checkbox__glyph" />
		</span>
	);
}

export default React.memo(MarkerCheckbox);
