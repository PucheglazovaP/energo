import { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import useOutsideClick from '../../Hooks/useOutsideClick';

import { ContextMenuItem, ContextMenuProps } from './types';
import styles from './ContextMenu.module.scss';

function ContextMenu(props: ContextMenuProps) {
	const { items, className, position, setPosition } = props;

	const handleClearPosition = useCallback(() => {
		setPosition(null);
	}, [setPosition]);

	const handleClick = useCallback(
		(item: ContextMenuItem) => {
			if (item.onClick) {
				item.onClick();
			}
			handleClearPosition();
		},
		[handleClearPosition],
	);
	const ref = useOutsideClick(!!position, handleClearPosition);
	const positionStyles = useMemo(() => {
		return {
			left: position?.x ?? 0,
			top: position?.y ?? 0,
		};
	}, [position]);
	return (
		<div
			className={clsx(styles.container, className)}
			style={positionStyles}
			ref={ref}
			onMouseLeave={handleClearPosition}
		>
			{items.map((item) => {
				if (!item.body)
					return (
						<button
							key={item.name}
							className={styles.item}
							onClick={() => handleClick(item)}
							disabled={item.isDisabled}
						>
							{item.name}
						</button>
					);
				return <div key={item.name}>{item.body}</div>;
			})}
		</div>
	);
}

export default ContextMenu;
