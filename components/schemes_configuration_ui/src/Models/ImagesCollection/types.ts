export interface Image {
	id: number;
	name: string;
	binary?: string;
}

export interface ImagesCollectionModel {
	list: Image[];
	isLoading: boolean;
}
