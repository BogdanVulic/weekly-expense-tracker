import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense } from '../models/expense.interface';
import { DaySelectionService } from '../services/days-selection.service';

@Component({
	selector: 'app-expense-entry',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './expense-entry.component.html',
	styleUrl: './expense-entry.component.scss'
})
export class ExpenseEntryComponent implements OnInit {

	private selectedDay: string;
	private newExpense: Expense | null;
	days: string[];
	@Input() expense: Expense | null;
	@Output() addExpense = new EventEmitter<Expense>();
	@Output() isFormActive = new EventEmitter<boolean>();
	@Output() updateExpense = new EventEmitter<Expense>();

	expenseEntryForm: FormGroup;

	constructor(
		private daySelectionService: DaySelectionService,
	) {
	}

	ngOnInit(): void {
		this.daySelectionService.selectedDay.subscribe(day => {
			this.selectedDay = day;
		});
		this.days = this.daySelectionService.days;
		this.generateForm();
	}

	onSubmit(): void {
		if (this.expense) {
			console.log(this.expense);
			
			this.updateExpense.emit({
				...this.expense,
				category: this.expenseEntryForm.get('category')?.value,
				amount: this.expenseEntryForm.get('amount')?.value,
				day: this.expenseEntryForm.get('day')?.value,
				isEditing: false
			})
		}
		else {
			this.newExpense = {
				category: this.expenseEntryForm.get('category')?.value,
				amount: this.expenseEntryForm.get('amount')?.value,
				day: this.selectedDay,
				id: this.createId()
			}
			this.addExpense.emit(this.newExpense);
			this.isFormActive.emit(false);
		}
		this.newExpense = null;
		this.expenseEntryForm.reset();
	}

	generateForm() {
		this.expenseEntryForm = new FormGroup({
			'category': new FormControl(this.expense ? this.expense.category : null, Validators.required),
			'amount': new FormControl(this.expense ? this.expense.amount : null, Validators.required),
			'day': new FormControl(this.expense ? this.expense.day : null, this.expense ? Validators.required : null)
		})
	}

	createId(): string {
        return "id" + Math.random().toString(16).slice(2)
	}

	cancel() {
		if (this.expense) {
			this.updateExpense.emit({
				...this.expense,
				isEditing: false
			})
		}
		else {
			this.isFormActive.emit(false);
		}
	}
}