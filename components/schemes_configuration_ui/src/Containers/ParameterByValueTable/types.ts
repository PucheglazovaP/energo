export type SearchTextParams = {
	shortName: string;
	name: string;
};

export enum SearchTextName {
	shortName = 'shortName',
	name = 'name',
}

export type Accessors = 'shortName' | 'name' | '';
