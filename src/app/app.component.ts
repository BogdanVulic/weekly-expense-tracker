import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseEntryComponent } from './expense-entry/expense-entry.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { TabsComponent } from './tabs/tabs.component';
import { Expense } from './models/expense.interface';
import { ExpenseService } from './services/expense.service';
import { DaySelectionService } from './services/days-selection.service';
import { DOCUMENT, NgClass, isPlatformBrowser } from '@angular/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ExpenseEntryComponent, ExpenseListComponent, TabsComponent, NgClass, ReactiveFormsModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {


	@ViewChild('weeklyBudgetModalRef') weeklyBudgetModalTemplate!: TemplateRef<any>;
	weeklyBudgetModal!: NgbModalRef;

	public expenses: Expense[] = [];
	selectedDay!: string;
	budget!: number;
	isFormActive: boolean = false;
	weeklyBudgetForm!: FormGroup;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private expenseService: ExpenseService,
		private daysSelectionsService: DaySelectionService,
		private modalService: NgbModal,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		const localStorage = this.document.defaultView?.localStorage;

		if (localStorage) {
			this.budget = Number(localStorage.getItem('budget'));
			console.log(this.budget);
			
		}
		
		this.fetchExpenses();
		this.daysSelectionsService.selectedDay.subscribe(day => {
			this.selectedDay = day;
			this.handleDaySelection(day);
		})
	}

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this.platformId) && !this.budget) {
			this.weeklyBudgetModal = this.modalService.open(this.weeklyBudgetModalTemplate, {
				centered: true,
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				windowClass: 'largeModal'
			});

			this.generateForm();
		}
	}

	generateForm() {
		this.weeklyBudgetForm = new FormGroup({
			'budget': new FormControl(null, Validators.required)
		})
	}

	calculateSavings() {
		if(this.budget) {
			return Number(this. budget - this.calculateTotal())

		}
		return 0
	}

	saveBudget() {
		this.budget = this.weeklyBudgetForm.controls['budget'].value;
		localStorage.setItem('budget', this.weeklyBudgetForm.controls['budget'].value)
		this.weeklyBudgetModal.close();
	}

	calculateTotal(): number {
		return this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
	}

	addExpense(newExpense: Expense): void {
		this.expenseService.addExpense(newExpense);
		this.fetchExpenses();
	}

	fetchExpenses(): void {
		this.expenses = this.expenseService.getExpenses();
	}

	deleteExpense(expenseId: string): void {
		this.expenseService.deleteExpense(expenseId);
		this.updateExpenses();
	}

	handleDaySelection(day: string): void {
		this.selectedDay = day;
		this.fetchExpenses();
	}

	updateExpense(expense: Expense): void {
		this.expenseService.updateExpense(expense);
		this.updateExpenses();
	}

	updateExpenses(): void {
		this.expenses = this.expenseService.getExpenses();
	}

	activateForm(event?: boolean) {
		if (event) {
			this.isFormActive = event
		}
		else {
			this.isFormActive = !this.isFormActive;
		}
	}

	exportExcel() {
		let workbook = new Workbook();
		let worksheet = workbook.addWorksheet('expenses');
		worksheet.columns = [
			{ header: 'Id', key: 'id', width: 30 },
			{ header: 'Amount', key: 'amount', width: 30 },
			{ header: 'Category', key: 'category', width: 30 },
			{ header: 'Day', key: 'day', width: 30 },
		];

		this.expenses.forEach(e => {
			worksheet.addRow({
				id: e.id,
				amount: e.amount + '',
				category: e.category,
				day: e.day
			}, "n");
		});

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fs.default(blob, 'Expenses.xlsx');
		})
	}

}
