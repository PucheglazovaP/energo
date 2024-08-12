import { createStore } from 'effector';

import {
	closeModal,
	openModal,
	popModal,
	switchModalsBanners,
	switchModalsDynamicObject,
} from './events';
import { switchModal } from './types';

export const $modals = createStore<string[]>([]);
export const $switchModal = createStore<switchModal>({
	switchModalTransparent: false,
	switchModalDynamicObject: false,
});

$modals.on(openModal, (modalStack, modalName) => {
	if (modalStack.includes(modalName)) return modalStack;
	return [...modalStack, modalName];
});

$modals.on(closeModal, (modalStack, modalName) => {
	if (!modalStack.includes(modalName)) return modalStack;
	return modalStack.filter((entryModalName) => entryModalName !== modalName);
});

$modals.on(popModal, (modalStack) => {
	if (modalStack.length < 1) return modalStack;
	return modalStack.slice(-1);
});

//InformationAboutBanners  InformationAboutDynamicObjects

$switchModal.on(switchModalsBanners, (state) => ({
	...state,
	switchModalTransparent: !state.switchModalTransparent,
}));

$switchModal.on(switchModalsDynamicObject, (state) => ({
	...state,
	switchModalDynamicObject: !state.switchModalDynamicObject,
}));
