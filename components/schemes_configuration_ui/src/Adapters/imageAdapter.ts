import { ImageResponse } from '../Shared/types';
import getFileExtension from '../Utils/getFileExtension';
import { getPNG } from '../Utils/WMF2PNG';

export default async function imageAdapter(result: string) {
	const parsedResult = JSON.parse(result);
	if (parsedResult.Response.Tables[0].Rows.length > 0) {
		const data: ImageResponse = parsedResult.Response.Tables[0].Rows[0];
		const extension = getFileExtension(data.NAME);
		const image = await convertImage(extension, data.BINARY_FILE);
		return { fileName: data.NAME, image, extension };
	}
	return { fileName: '', image: '', extension: '' };
}

export function uploadImageAdapter(result: string) {
	const parsedResult = JSON.parse(result);
	if (parsedResult.Response.Tables[0].Rows.length > 0) {
		const data: ImageResponse = parsedResult.Response.Tables[0].Rows[0];
		return data.BINARY_FILE;
	}
	return '';
}

export async function convertImage(extension: string, binaryImage: string) {
	switch (extension) {
		case 'wmf': {
			const result = await getPNG(binaryImage);
			return result;
		}
		case 'svg': {
			return `data:image/${extension}+xml;utf8;base64,${binaryImage}`;
		}
		default: {
			return `data:image/${extension};base64,${binaryImage}`;
		}
	}
}
