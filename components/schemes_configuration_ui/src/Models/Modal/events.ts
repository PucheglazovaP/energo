import { createEvent } from 'effector';

export const openModal = createEvent<string>('Open modal');
export const closeModal = createEvent<string>('Close modal');
export const popModal = createEvent('Pop modal');

// InformationAboutBanners  InformationAboutDynamicObjects

export const switchModalsBanners = createEvent();
export const switchModalsDynamicObject = createEvent();
