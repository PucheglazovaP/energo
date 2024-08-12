import { EnergyResource } from '../../Models/EnergyResources/types';
import { SelectOption } from '../../UI/Select/types';

export interface EnergyResourceSelectorWithTitleProps {
	energyResources: SelectOption[];
	onChangeEnergyResource: (energyResources: EnergyResource[]) => void;
	baseHour?: number;
	title: string;
	className?: string;
}
