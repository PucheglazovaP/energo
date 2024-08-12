export type HeatingSeasonModification = {
	modifiedBy: string;
	modifiedDate: string;
};

export enum HeatingSeasonStatus {
	End = 0,
	Current = 1,
	Future = 2,
}

export type HeatingSeason = {
	seasonCode: number;
	status: HeatingSeasonStatus;
	seasonStartDate: string | null;
	seasonEndDate: string | null;
	creationDate: string;
	createdBy: string;
	modifications: HeatingSeasonModification[];
};

export type HeatingSeasons = {
	heatingSeasons: HeatingSeason[];
	currentSeasonId: number | null;
	isLoading: boolean;
};
