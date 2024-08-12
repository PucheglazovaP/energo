import { SelectOption } from '../../../Components/Select/types';
import { User } from '../../../Types/UserTypes';

export interface VacantEntitiesState {
	isModalOpen: boolean;
	isLoading: boolean;
	vacantEntities: VacantEntity[];
	totalCount: number;
	vacantEntitiesSelectorData: SelectOption[];
	activeVacantEntityType: VacantEntityType;
}

export type VacantEntityStatus = 0 | 1;

export interface VacantEntity {
	id: string;
	status: VacantEntityStatus;
}

export interface VacantEntityParams extends User {
	pageRowCount: number;
	pageNumber: number;
	vacantEntityType: VacantEntityType;
}

export interface VacantEntityResponse {
	Number: number;
	etc: VacantEntityStatus;
}

export enum VacantEntityType {
	Group = '[appl_tags].[Get_ListGroupsFreeNumbers]',
	Device = '[appl_tags].[Get_ListDevicesFreeNumbers]',
	Channel = '[appl_tags].[Get_ListChannelsFreeNumbers]',
}
