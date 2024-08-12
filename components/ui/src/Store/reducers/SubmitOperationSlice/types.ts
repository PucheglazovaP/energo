import { ReactNode } from 'react';

import {
	SubmitButtonText,
	SubmitOperation,
	SubmitOperationTitle,
} from '../../../Components/SubmitOperation/types';

export interface SubmitSlice {
	isOpen: boolean;
	title: SubmitOperationTitle | null;
	body: ReactNode;
	submitOperation: SubmitOperation;
	submitButtonText: SubmitButtonText;
}
