import { memo, useCallback } from 'react';
import clsx from 'clsx';

import { ButtonProps } from './types';

function ContextMenuButton(props: ButtonProps) {
	const { item, onClick, className } = props;

	const handleClick = useCallback(() => {
		onClick && onClick(item);
	}, [item, onClick]);

	if (item.isNotButton) {
		return <>{item.renderFn ? item.renderFn() : item.name}</>;
	}

	return (
		<button
			className={clsx(className, item.className)}
			onClick={handleClick}
			disabled={item.isDisabled}
		>
			{item.renderFn ? item.renderFn() : item.name}
		</button>
	);
}

export default memo(ContextMenuButton);
