import { SelectOption } from '../../../Components/Select/types';

import { VacantEntityType } from './types';

export const vacantEntitiesSelectorData: SelectOption[] = [
	{ label: 'Канал', value: VacantEntityType.Channel, isSelected: true },
	{ label: 'Прибор', value: VacantEntityType.Device, isSelected: false },
	{ label: 'Группа', value: VacantEntityType.Group, isSelected: false },
];
