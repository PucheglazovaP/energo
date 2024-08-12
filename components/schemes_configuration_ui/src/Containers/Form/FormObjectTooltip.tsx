import { useMemo, useRef } from 'react';
import clsx from 'clsx';

import { TooltipProps } from './types';

import styles from './Form.module.css';

function FormObjectTooltip({
	leftPosition,
	topPosition,
	formObject,
}: TooltipProps) {
	const groupName = `${formObject?.groupName || ''}`;
	const unitName = `${formObject?.unitName ? ',' : ''} ${
		formObject?.unitName || ''
	}`;
	const tooltipRef = useRef<HTMLDivElement | null>(null);

	const elementHeight = useMemo(() => {
		const elementHeight: number =
			tooltipRef?.current?.getBoundingClientRect().height || 0;
		return elementHeight;
	}, [tooltipRef.current]);

	return (
		<div
			style={{
				width: 'auto',
				height: 'auto',
				top: `calc(${topPosition}px - ${elementHeight}px)`,
				left: `${leftPosition}px`,
				visibility: elementHeight === 0 ? 'hidden' : 'visible',
			}}
			className={clsx(styles.tooltip, 'form_object_tooltip')}
			ref={tooltipRef}
		>
			<div className={styles.tooltip_title}>
				{groupName}
				{unitName}
			</div>
			<div>Каналы {formObject?.channelsList?.replace(/,/g, ', ') || 'Н/Д'}</div>
			<div>
				Код группы{' '}
				{formObject?.groupId && formObject.groupId !== 9999
					? formObject.groupId
					: 'Н/Д'}
			</div>
		</div>
	);
}

export default FormObjectTooltip;
