import { LayoutCellProps } from '../types';

function HeaderCell(props: LayoutCellProps) {
	const { children, className } = props;
	return <div className={className}>{children}</div>;
}

export default HeaderCell;
