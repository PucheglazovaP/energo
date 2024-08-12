import { createEffect } from 'effector';

import { imagesCollectionAdapter } from '../../Adapters/imagesCollectionAdapter';
import { getImagesCollectionQuery } from '../../Const/Queries/getImagesCollection';
import { FetchImagesCollectionsParams } from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	setImagesCollectionIsLoading,
	setImagesCollectionList,
} from './events';
import { Image } from './types';

export const getImagesCollectionFx = createEffect(
	async (params: FetchImagesCollectionsParams) => {
		const list = await rpcQuery<Image[]>(
			getImagesCollectionQuery(params),
			imagesCollectionAdapter,
		);
		return list;
	},
);

getImagesCollectionFx.done.watch(({ result }) => {
	setImagesCollectionList(result);
});

getImagesCollectionFx.fail.watch(({ error }) => {
	handleError(error);
});

getImagesCollectionFx.pending.watch((pending) => {
	if (pending) {
		setImagesCollectionIsLoading(true);
	}
});

getImagesCollectionFx.finally.watch(() => {
	setImagesCollectionIsLoading(false);
});
