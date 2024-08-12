export enum CollectionType {
	single = 'single',
	multiple = 'multiple',
}

export type FormParameters = {
	code: number;
	name: string;
};

export interface ImagesCollectionParametersModel {
	type: CollectionType;
	checkedImagesIds: number[];
	previewImageId: number;
	previewImage: string;
	formParameters: FormParameters | null;
}
