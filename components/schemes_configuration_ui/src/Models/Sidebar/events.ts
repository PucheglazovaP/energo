import { createEvent } from 'effector';

import { TreeTypes } from '../../Shared/types';

export const setOpenFlag = createEvent<boolean>();
export const setDisabledFlag = createEvent<boolean>();
export const setContextMenuId = createEvent<number>();
export const changeType = createEvent<TreeTypes>();
