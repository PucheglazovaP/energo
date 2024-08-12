import { Delete } from '../../UI/Confirmation';

import { useDeleteEmergencyEventParameter } from './useDeleteEmergencyEventParameter';

const TITLE = 'Вы действительно хотите удалить узел?';

function DeleteEmergencyEventParameter() {
	const { handleCloseModal, handleConfirmDelete } =
		useDeleteEmergencyEventParameter();

	return (
		<Delete
			title={TITLE}
			onClose={handleCloseModal}
			onDelete={handleConfirmDelete}
		/>
	);
}

export default DeleteEmergencyEventParameter;
