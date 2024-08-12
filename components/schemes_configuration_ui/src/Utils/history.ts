import { Location, NavigateFunction } from 'react-router-dom';

type History = {
	location: Location | null;
	navigate: NavigateFunction | null;
};
export const history: History = {
	location: null,
	navigate: null,
};
