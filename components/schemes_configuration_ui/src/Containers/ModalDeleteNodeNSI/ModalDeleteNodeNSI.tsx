import { Delete } from '../../UI/Confirmation';

import useDeleteNodeNSI from './useDeleteNodeNSI';

function ModalDeleteNodeNSI() {
	const { handleClose, handleConfirm, title } = useDeleteNodeNSI();

	return (
		<Delete title={title} onClose={handleClose} onDelete={handleConfirm} />
	);
}

export default ModalDeleteNodeNSI;
