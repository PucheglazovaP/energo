import { combine } from 'effector';

import { $imagesCollection } from '../ImagesCollection';
import { $imagesCollectionParameters } from '../ImagesCollectionParameters';
import { $navigation } from '../Navigation';

export const $imagesCollectionForm = combine(
	$imagesCollection,
	$imagesCollectionParameters,
	$navigation,
	(imagesCollection, imagesCollectionParameters, navigation) => {
		return {
			versionId: navigation.versionId || 90,
			list: imagesCollection.list,
			listIsLoading: imagesCollection.isLoading,
			type: imagesCollectionParameters.type,
			checkedImagesIds: imagesCollectionParameters.checkedImagesIds,
			checkedImages: imagesCollection.list.filter((img) =>
				imagesCollectionParameters.checkedImagesIds.includes(img.id),
			),
			previewImageId: imagesCollectionParameters.previewImageId,
			previewImage: imagesCollectionParameters.previewImage,
			formParameters: imagesCollectionParameters.formParameters,
		};
	},
);
