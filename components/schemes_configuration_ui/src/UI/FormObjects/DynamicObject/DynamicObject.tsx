import React, { useEffect, useState } from 'react';

import { DynamicObjectProps } from './types';

function DynamicObject(props: DynamicObjectProps) {
	const {
		objectValue,
		handleClick = () => {},
		className,
		onMouseMove,
		onMouseLeave,
	} = props;
	const [imageLink, setImageLink] = useState('');
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

	const handleMouseEnter = (evt: React.MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		onMouseMove && onMouseMove(evt, objectValue);
	};
	const handleMouseLeave = (evt: React.MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		onMouseLeave && onMouseLeave(evt, objectValue);
	};
	return (
		<image
			xlinkHref={imageLink}
			width={objectValue.width}
			height={objectValue.height}
			x={objectValue.x}
			y={objectValue.y}
			className={className}
			style={{
				cursor:
					objectValue.gotonCode || objectValue.isLinkEnabled
						? 'pointer'
						: 'default',
			}}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{imageComment ? <title>{imageComment}</title> : null}
		</image>
	);
}

export default DynamicObject;
