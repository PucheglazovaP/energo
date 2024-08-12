import { Delete } from '../../../UI/Confirmation';

import usePrintFormParametersUnsync from './usePrintFormParametersUnsync';

function PrintFormParametersUnsync() {
	const { handleConfirm, handleClose } = usePrintFormParametersUnsync();

	return (
		<Delete
			title="Вы действительно хотите удалить параметр из текущей отчетной формы?"
			onClose={handleClose}
			onDelete={handleConfirm}
		/>
	);
}

export default PrintFormParametersUnsync;
