import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import useOutsideClick from '../../Facades/useOutsideClick';

import ContextMenuButton from './ContextMenuButton';
import ContextMenuSeparator from './ContextMenuSeparator';
import {
	ContextMenuItem,
	ContextMenuPosition,
	ContextMenuProps,
	IntermediateProps,
} from './types';

import styles from './ContextMenu.module.css';

function ContextMenuIntermediate(props: IntermediateProps) {
	const { item } = props;

	const [childPos, setChildPos] = useState<ContextMenuPosition | null>(null);

	const showChildren = useCallback(() => {
		setChildPos({ x: '100%', y: '0' });
	}, []);

	const hideChildren = useCallback(() => {
		setChildPos(null);
	}, []);

	return (
		<div
			className={clsx(styles.item, item.isDisabled && styles.item_disabled)}
			onMouseEnter={showChildren}
			onMouseLeave={hideChildren}
		>
			{item.renderFn ? item.renderFn() : item.name}
			{item.children && childPos && (
				<ContextMenu
					items={item.children}
					position={childPos}
					setPosition={hideChildren}
				/>
			)}
		</div>
	);
}

function ContextMenu(props: ContextMenuProps) {
	const {
		items,
		className,
		position,
		setPosition,
		onCloseContextMenu = () => {},
	} = props;

	const handleClearPosition = useCallback(() => {
		onCloseContextMenu();
		setPosition(null);
	}, [onCloseContextMenu, setPosition]);

	const handleClick = useCallback(
		(item: ContextMenuItem) => {
			if (item.onClick) {
				item.onClick();
			}

			if (!item.isNotCloseOnClick) {
				handleClearPosition();
			}
		},
		[handleClearPosition],
	);
	const ref = useOutsideClick(!!position, handleClearPosition);

	const getTopPosition = useCallback(() => {
		const windowHeight: number = window.innerHeight;
		const elementHeight: number =
			ref?.current?.getBoundingClientRect().height || 0;
		const elementY = position?.y || 0;
		let isOutOfWindow: boolean = false;
		// By default top position equal to received position y
		let topPosition = elementY;
		if (typeof elementY === 'number') {
			// Check if element is not fully on the screen
			isOutOfWindow = windowHeight - elementY < elementHeight;
			if (isOutOfWindow) {
				// If the element is out of window, calculate top position
				topPosition = elementY - elementHeight;
			}
		}
		return topPosition;
	}, [position, ref]);

	const getLeftPosition = useCallback(() => {
		const elementX = position?.x ?? 0;
		if (typeof elementX === 'string') {
			return elementX;
		}
		let isOutOfWindow: boolean = false;
		const windowWidth: number = window.innerWidth;
		const elementWidth: number =
			ref?.current?.getBoundingClientRect().width || 0;
		let leftPosition = elementX;
		if (typeof elementX === 'number') {
			// Check if element is not fully on the screen
			isOutOfWindow = windowWidth - elementX < elementWidth;
			if (isOutOfWindow) {
				// If the element is out of window, calculate left position
				leftPosition = elementX - elementWidth;
			}
		}
		return leftPosition;
	}, [position, ref]);
	/*
		Calculate position styles for menu;
		If there is no space down, drop it up.
	*/
	const positionStyles = useMemo(() => {
		const top = getTopPosition();
		const left = getLeftPosition();
		return {
			left,
			top,
		};
	}, [getTopPosition, getLeftPosition]);
	return (
		<div
			className={clsx(
				'kit_context_menu',
				styles.root,
				position ? styles.context_menu : styles.context_menu_hidden,
				className,
			)}
			style={positionStyles}
			ref={ref}
		>
			{items
				.filter((item) => (item.isVisible == null ? true : item.isVisible))
				.map((item) => {
					return (
						<div
							className={clsx(
								styles.container,
								item.className || '',
								item.isDisabled && styles.item_disabled,
							)}
							key={item.key || item.name}
						>
							{!item.children?.length ? (
								<ContextMenuButton
									className={styles.item}
									item={item}
									onClick={handleClick}
								/>
							) : (
								<ContextMenuIntermediate item={item} />
							)}
							{item.withSeparator && (
								<ContextMenuSeparator name={item.separatorName} />
							)}
						</div>
					);
				})}
		</div>
	);
}

export default ContextMenu;
