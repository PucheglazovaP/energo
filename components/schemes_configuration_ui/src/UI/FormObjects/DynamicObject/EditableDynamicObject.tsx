import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { EditDynamicObjectProps } from './types';

import styles from './DynamicObject.module.css';

function DynamicObject(props: EditDynamicObjectProps) {
	const {
		objectValue,
		handleClick = () => {},
		className,
		isSelected,
		onContextMenu,
	} = props;
	const [imageLink, setImageLink] = useState('');
	const [position, setPosition] = useState<{
		x: number;
		y: number;
	}>({
		x: objectValue.x,
		y: objectValue.y,
	});
	const [size, setSize] = useState<{
		width: number;
		height: number;
	}>({
		width: objectValue.width,
		height: objectValue.height,
	});
	useEffect(() => {
		setPosition({ x: objectValue.x, y: objectValue.y });
		setSize({ width: objectValue.width, height: objectValue.height });
	}, [objectValue.x, objectValue.y, objectValue.width, objectValue.height]);

	const handleContextMenu = (evt: React.MouseEvent) => {
		evt.preventDefault();
		if (onContextMenu) {
			onContextMenu(evt, objectValue);
		}
	};
	const [imageComment, setImageComment] = useState('');

	useEffect(() => {
		if (objectValue.images) {
			const image = objectValue.images.find((item) => {
				if (objectValue.selectedImageNumberFromGroup)
					return item.fileNumber === objectValue.selectedImageNumberFromGroup;
				return item.fileNumber === objectValue.selectedFileNumber;
			});
			if (image) {
				setImageLink(image.url);
				setImageComment(image.comment || '');
			}
		}
	}, [objectValue]);
	return objectValue.objectType === 'Динамический объект' ? (
		<>
			{imageLink ? (
				<>
					<rect
						fill="transparent"
						width={size.width}
						height={size.height}
						x={position.x}
						y={position.y}
						className={clsx(isSelected && styles.dynamic_object__selected)}
					/>
					<image
						xlinkHref={imageLink}
						className={clsx(
							styles.dynamic_object,
							className,
							isSelected && styles.dynamic_object__selected,
						)}
						onClick={handleClick}
						onContextMenu={handleContextMenu}
						width={size.width}
						height={size.height}
						x={position.x}
						y={position.y}
					>
						{imageComment ? <title>{imageComment}</title> : null}
					</image>
				</>
			) : (
				<rect
					stroke="#000000"
					strokeDasharray="5"
					fill="rgba(0,0,0,0)"
					className={clsx(isSelected && styles.dynamic_object__selected)}
					onClick={handleClick}
					onContextMenu={handleContextMenu}
					width={size.width}
					height={size.height}
					x={position.x}
					y={position.y}
				/>
			)}
		</>
	) : null;
}

export default DynamicObject;
