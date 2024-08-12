import { createEffect } from 'effector';

import { convertImage } from '../../Adapters/imageAdapter';
import { imagesCollectionAdapter } from '../../Adapters/imagesCollectionAdapter';
import { getImageByIdQuery } from '../../Const/Queries/getImageFromCollection';
import { FetchImageByIdParams } from '../../Shared/types';
import getFileExtension from '../../Utils/getFileExtension';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { Image } from '../ImagesCollection/types';

import { setPreviewImage } from './events';

export const getImageByIdFx = createEffect(
	async (params: FetchImageByIdParams) => {
		const [image] = await rpcQuery<Image[]>(
			getImageByIdQuery(params),
			imagesCollectionAdapter,
		);
		return image;
	},
);

getImageByIdFx.fail.watch(({ error }) => {
	handleError(error);
});

export const loadBinaryImage = createEffect(
	async (params: FetchImageByIdParams) => {
		const image = await getImageByIdFx(params);
		const extension = getFileExtension(image.name);
		const src = await convertImage(extension, image.binary || '');
		return src;
	},
);

export const loadPreviewImage = createEffect(
	async (params: FetchImageByIdParams) => {
		const binary = await loadBinaryImage(params);
		return binary;
	},
);

loadPreviewImage.done.watch(({ result }) => {
	setPreviewImage(result);
});
