import { createEvent } from 'effector';

import { EditReportItemParams, EditReportParams } from '../../Shared/types';

export const toggleIsOpenSidePanel = createEvent();

export const setSelectedReportId = createEvent<number | null>();

export const setReportContextMenuId = createEvent<number>();

export const setReportItemContextMenuId = createEvent<number>();

export const setEditReportData = createEvent<EditReportParams>();

export const setEditReportItemData = createEvent<EditReportItemParams>();
