import { Image } from '../Models/ImagesCollection/types';
import { DynamicObjectValue } from '../Shared/Types/formObject';
import getFileExtension from '../Utils/getFileExtension';

import { convertImage } from './imageAdapter';

/**
 * Convert images to dynamic object value with default properties
 * @param img - image itself
 */
export async function convertImageToDynamicObjectValue(
	img: Image,
	order: number,
): Promise<DynamicObjectValue> {
	const extension = getFileExtension(img.name);
	const binary = await convertImage(extension, img.binary || '');
	return {
		comment: '',
		fileName: img.name,
		url: binary,
		fileNumber: order,
	};
}
