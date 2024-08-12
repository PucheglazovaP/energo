import { ReactNode } from 'react';

export interface ModalProps {
	title: ReactNode;
	backdrop?: Backdrop;
	onClose: () => void;
	className?: string;
	children: ReactNode;
	withClose?: boolean;
}

export enum Backdrop {
	DEFAULT = 'default', // Серый фон, кликабельный
	STATIC = 'static', // Серый фон, не кликабельный
	NONE = 'none', // Никакого фона
}
