export type Version = {
	code: number;
	name: string;
	systemCode: number;
};

export interface VersionsListModel {
	versions: Version[];
	isLoading: boolean;
}
