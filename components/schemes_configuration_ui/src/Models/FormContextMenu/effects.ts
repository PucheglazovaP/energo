import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { convertImageToDynamicObjectValue } from '../../Adapters/convertImageToDynamicObjectValue';
import { deleteObjectParameter } from '../../Adapters/deleteObjectParameter';
import { moveObjectAdapter } from '../../Adapters/moveObjectAdapter';
import { updateObjectParameter } from '../../Adapters/updateObjectParameter';
import { uploadImageAdapter } from '../../Adapters/uploadImageAdapter';
import { createObjectParameterQuery } from '../../Const/Queries/createObjectParameterQuery';
import { deleteObjectQuery } from '../../Const/Queries/deleteObjectImage';
import { uploadImageQuery } from '../../Const/Queries/image';
import { moveObjectQuery } from '../../Const/Queries/moveObject';
import { updateFormObjectQuery } from '../../Const/Queries/updateFormObject';
import {
	AddFieldToFormObjectParams,
	AddImagesParams,
	DeleteObjectParams,
	MoveObjectParams,
	UpdateFormObjectParams,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';
import { Image } from '../ImagesCollection/types';
import { getImageByIdFx } from '../ImagesCollectionParameters/effects';

import { addImage } from './events';

export const moveImageFx = createEffect(async (params: MoveObjectParams) => {
	const rowsMoved = await rpcQuery<string>(
		moveObjectQuery(params),
		moveObjectAdapter,
	);
	return rowsMoved;
});

export const addImagesFx = createEffect(async (params: AddImagesParams) => {
	const {
		startFileNumber,
		images,
		formId,
		objectId,
		versionId,
		userId,
		moduleName,
	} = params;

	Promise.allSettled(
		images.map((img, index) => {
			const order = startFileNumber + index;
			rpcQuery(
				createObjectParameterQuery({
					value: img.name,
					formId,
					objectId,
					versionId,
					parameterName: 'FilePicture',
					moduleName,
					userId,
					order,
				}),
			)
				.then(() => {
					getImageByIdFx({ id: img.id, userId, moduleName }).then(
						(newImage) => {
							convertImageToDynamicObjectValue(newImage, order).then(
								(adaptedImage) => {
									addImage(adaptedImage);
								},
							);
						},
					);
				})
				.catch((err) => {
					handleError(err);
				});
		}),
	);
});

export const deleteImageFx = createEffect(
	async (params: DeleteObjectParams) => {
		const rowsDeleted = await rpcQuery<number>(
			deleteObjectQuery(params),
			deleteObjectParameter,
		);
		return rowsDeleted;
	},
);

deleteImageFx.fail.watch(({ error }) => {
	handleError(error);
});

export const updateFormObjectFx = createEffect(
	async (params: UpdateFormObjectParams) => {
		const rowsUpdated = await rpcQuery<number>(
			updateFormObjectQuery(params),
			updateObjectParameter,
		);
		return rowsUpdated;
	},
);

updateFormObjectFx.fail.watch(({ error }) => {
	handleError(error);
});

export const uploadObjectImageFx = createEffect(
	async (params: AddFieldToFormObjectParams) => {
		try {
			let img = await rpcQuery<Image>(
				uploadImageQuery({
					formId: params.formId || 0,
					fileName: params.name,
					image: params.binary,
					replaceFlag: 0,
					userId: params.userId,
					versionCode: params.versionCode,
					moduleName: params.moduleName,
				}),
				uploadImageAdapter,
			);
			img.name = params.name;
			return img;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при загрузке изображения');
			}

			throw err;
		}
	},
);
