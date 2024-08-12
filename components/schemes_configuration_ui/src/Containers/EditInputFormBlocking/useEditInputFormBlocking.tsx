import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $inputFormSession } from '../../Models/InputFormSession';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';

export function useEditInputFormBlocking() {
	const { errorMessage } = useStore($inputFormSession);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditInputFormBlocking);
	}, []);

	return {
		errorMessage,
		handleCloseModal,
	};
}
