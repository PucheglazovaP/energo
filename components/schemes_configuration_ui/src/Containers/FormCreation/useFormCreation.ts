import { FormCreationFrom } from './types';
import useCreateFromDynamicObject from './useCreateFromDynamicObject';
import useCreateFromTransparent from './useCreateFromTransparent';
import useCreateFromTree from './useCreateFromTree';

function useFormCreation(from: FormCreationFrom) {
	const {
		initForm: initFormFromTree,
		closeForm: closeFormFromTree,
		acceptForm: acceptFormFromTree,
		resetForm: resetFormFromTree,
	} = useCreateFromTree();
	const {
		initForm: initFormFromTransparent,
		closeForm: closeFormFromTransparent,
		acceptForm: acceptFormFromTransparent,
		resetForm: resetFormFromTransparent,
	} = useCreateFromTransparent();
	const {
		initForm: initFormFromDynamicObject,
		closeForm: closeFormFromDynamicObject,
		acceptForm: acceptFormFromDynamicObject,
		resetForm: resetFormFromDynamicObject,
	} = useCreateFromDynamicObject();

	if (from === 'transparent') {
		return {
			handleInit: initFormFromTransparent,
			handleClose: closeFormFromTransparent,
			handleAccept: acceptFormFromTransparent,
			handleReset: resetFormFromTransparent,
		};
	}

	if (from === 'dynamicObject') {
		return {
			handleInit: initFormFromDynamicObject,
			handleClose: closeFormFromDynamicObject,
			handleAccept: acceptFormFromDynamicObject,
			handleReset: resetFormFromDynamicObject,
		};
	}

	return {
		handleInit: initFormFromTree,
		handleClose: closeFormFromTree,
		handleAccept: acceptFormFromTree,
		handleReset: resetFormFromTree,
	};
}

export default useFormCreation;
