import React, { Suspense } from 'react';
import clsx from 'clsx';

import { GlyphProps } from './types';

import './Glyph.css';

const Loading: React.FC = () => {
	return <div className="glyph__loading" />;
};

/**
 * Символ обозначающий какое-либо слово
 *
 * Глиф находится в квадратной области.
 * Размер области по умолчанию `1rem`.
 * Для переопределения размера используется
 * кастомное css свойство `--glyph-size`
 */
function Glyph(props: GlyphProps) {
	const { name, className } = props;
	const Image = React.lazy(() => {
		return import(`./Glyphs/${name}.tsx`);
	});

	const glyphClassName = clsx(['glyph', className]);

	return (
		<div className={glyphClassName}>
			<Suspense fallback={<Loading />}>
				<Image />
			</Suspense>
		</div>
	);
}

export default React.memo(Glyph);
