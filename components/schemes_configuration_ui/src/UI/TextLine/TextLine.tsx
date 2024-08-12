import { useState } from 'react';
import clsx from 'clsx';

import { TextLineProps } from './types';

import styles from './TextLine.module.css';

function TextLine(props: TextLineProps) {
	const { textContent, className, style } = props;
	const [isOverflow, setIsOverflow] = useState(false);

	const handleRefChange = (node: HTMLParagraphElement) => {
		if (node) {
			const { offsetWidth, scrollWidth } = node;
			setIsOverflow(offsetWidth < scrollWidth);
		}
	};

	return (
		<div
			className={clsx('kit_textline', styles.container, className)}
			style={style}
		>
			<p
				ref={handleRefChange}
				title={isOverflow ? textContent?.toString() : undefined}
				className={styles.text}
			>
				{textContent}
			</p>
		</div>
	);
}

export default TextLine;
