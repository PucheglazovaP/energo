import DropDown from '../../Components/DropDown';
import ETLLog from '../ETLLog';

import { LogDropDownProps } from './types';

function LogDropDown({ className, style }: LogDropDownProps) {
	return (
		<DropDown className={className} style={style} title="!">
			<ETLLog />
		</DropDown>
	);
}

export default LogDropDown;
