import { createEvent } from 'effector';

import { EnergyResource } from './types';

export const setEnergyResourcesList = createEvent<EnergyResource[]>();

export const changeEnergyResource = createEvent<EnergyResource[]>();

export const setEnergyResourceId = createEvent<number>();
