import { ContentHeader } from '../../Types';
import { FiltersTitle } from '../ListContainer/types';

export const groups: ContentHeader = {
	title: FiltersTitle.GROUPS,
	buttons: [
		{
			title: 'Все',
		},
		{
			title: 'Избранные',
		},
		{
			title: 'Мои группы',
		},
		{
			title: 'eWork',
		},
	],
};
export const devices: ContentHeader = {
	title: FiltersTitle.DEVICES,
	buttons: [
		{
			title: 'Все',
		},
		{
			title: 'Избранные',
		},
	],
};
