import { createEvent } from 'effector';

import { Role } from '../../Shared/types';

export const getAuthentication = createEvent<void>('Get Authentication');

export const loadUserInfo = createEvent('Load user info');

export const setRoles = createEvent<Role[]>('Set roles');
