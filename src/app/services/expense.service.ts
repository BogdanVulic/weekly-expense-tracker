import { Inject, Injectable } from '@angular/core';
import { Expense } from '../models/expense.interface';
import { DOCUMENT } from '@angular/common';
import { DaySelectionService } from './days-selection.service';

@Injectable({
	providedIn: 'root'
})
export class ExpenseService {
	private expenses: Expense[] = [];
	private selectedDay: string;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private daySelectionService: DaySelectionService
	) {
		const localStorage = document.defaultView?.localStorage;
		const expensesFromStorage = localStorage?.getItem('expenses');
		this.expenses = expensesFromStorage ? JSON.parse(expensesFromStorage) : [];
		this.daySelectionService.selectedDay.subscribe(day => {
			this.selectedDay = day
		})
	}

	getExpenses(): Expense[] {
		if (this.selectedDay && this.selectedDay !== 'SUMMARY') {
			return this.expenses.filter(expense => expense.day === this.selectedDay);
		} else if (this.selectedDay === 'SUMMARY') {
			return this.expenses;
		}
		return this.expenses;
	}

	addExpense(expense: Expense): void {
		this.expenses.push(expense);
		this.updateLocalStorage();
	}

	updateExpense(updatedExpense: Expense): void {
		const index = this.expenses.findIndex(exp => exp.id === updatedExpense.id);
		if (index !== -1) {
			this.expenses[index] = updatedExpense;
			this.updateLocalStorage();
		}
	}

	deleteExpense(id: string): void {
		this.expenses = this.expenses.filter(exp => exp.id !== id);
		this.updateLocalStorage();
	}

	private updateLocalStorage(): void {
		this.expenses = this.expenses.map(expense => {
			expense.isEditing = false;
			return expense;
		})
		localStorage.setItem('expenses', JSON.stringify(this.expenses));
	}
}
