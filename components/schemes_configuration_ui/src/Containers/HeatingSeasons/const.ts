import { HeatingSeasonStatus } from '../../Models/HeatingSeasons/types';

export const heatingSeasonStatusList = {
	[HeatingSeasonStatus.End]: 'Завершён',
	[HeatingSeasonStatus.Current]: 'Текущий',
	[HeatingSeasonStatus.Future]: 'Будущий',
};
