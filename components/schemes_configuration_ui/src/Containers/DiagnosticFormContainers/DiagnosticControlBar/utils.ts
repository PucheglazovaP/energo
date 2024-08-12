import { FilterItem } from '../../../Models/DiagnosticCurrent/types';

export function getSelectorServers(
	servers: FilterItem[],
	selectedServerId: string,
) {
	return [
		{
			label: 'Сервер: Все',
			value: '',
			isSelected: selectedServerId === '',
		},
		...servers.map((item) => ({
			label: `Сервер: ${item.name}`,
			value: item.code,
			isSelected: item.code === selectedServerId,
		})),
	];
}

export default {};
