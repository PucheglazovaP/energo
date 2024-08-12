import { useLocation, useNavigate } from 'react-router-dom';

function useLayoutReportsUGE() {
	const location = useLocation();
	const navigate = useNavigate();
	const handleSwitcherChange = (id: string) => {
		navigate(id);
	};

	return {
		location,
		handleSwitcherChange,
	};
}

export default useLayoutReportsUGE;
