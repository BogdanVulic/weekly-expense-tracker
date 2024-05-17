export type Expense = {
	id: string;
	category: string;
	amount: number;
	day: string;
	isEditing?: boolean;
}