export default interface ReportFormProps {
	className?: string;
}
export type InputCellProps = {
	value: number | null | string;
	onEdit: (value: number | null | string) => void;
};
