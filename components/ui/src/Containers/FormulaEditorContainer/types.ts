export interface FormulaEditorHeader {
	groupNumber: number | null;
	groupName: string | null;
	isFormulaActive: boolean;
	onFormulaActiveToggle: () => void;
}
