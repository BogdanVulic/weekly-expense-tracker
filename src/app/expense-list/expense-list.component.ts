import { AfterViewInit, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Expense } from '../models/expense.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; import { MatIconModule } from '@angular/material/icon';
import { ExpenseEntryComponent } from '../expense-entry/expense-entry.component';
import { DaySelectionService } from '../services/days-selection.service';
import { ExpenseListItemComponent } from './expense-list-item/expense-list-item.component';
import { AgChartsAngular } from 'ag-charts-angular';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-expense-list',
	standalone: true,
	imports: [ReactiveFormsModule, MatIconModule, ExpenseEntryComponent, ExpenseListItemComponent, AgChartsAngular, NgClass],
	templateUrl: './expense-list.component.html',
	styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit, DoCheck {
	@Input() expenses!: Expense[];
	@Output() edit = new EventEmitter<number>();
	@Output() delete = new EventEmitter<string>();
	@Output() save = new EventEmitter<Expense[]>();
	@Output() update = new EventEmitter<Expense>();

	expenseListForm!: FormGroup;
	selectedDay!: string;
	refreshChart: boolean = true;

	public options!: any;

	constructor(public daySelectionService: DaySelectionService) {
		this.daySelectionService.selectedDay.subscribe(day => {
			this.selectedDay = day;
		})
	}

	ngOnInit(): void {
		this.generateForm();
	}

	ngDoCheck(): void {
		if (this.expenses) {
			this.options = {
				height: 500,
				data: this.mapPieChartData(),
				series: [
					{
						type: "pie",
						angleKey: "amount",
						legendItemKey: "category",
						sectorLabelKey: 'amount',
						sectorLabel: {
							color: 'white',
							fontWeight: 'bold',
						},
					}
				]
			};
		}
	}

	editExpense(id: string): void {
		let expense = this.expenses.find(expense => expense.id === id);
		this.expenses = this.expenses.map(expense => {
			expense.isEditing = false;
			return expense;
		})
		if (expense) {
			expense.isEditing = true;
		}
	}

	deleteExpense(id: string): void {
		this.delete.emit(id);
	}

	updateExpense(expense: Expense) {
		let updatedExpense = this.expenses.find(e => e.id === expense.id)
		if (updatedExpense) {
			updatedExpense.isEditing = false;
		}
		this.update.emit(expense);
	}

	generateForm() {
		this.expenseListForm = new FormGroup({
			'category': new FormControl(null, Validators.required),
			'amount': new FormControl(null, Validators.required)
		})
	}

	mapPieChartData() {
		let mappedData: Expense[] = [];
		this.expenses.forEach(expense => {
			let mappedExpense = mappedData.find((mappedExpense: Expense) => mappedExpense.category === expense.category);
			if(mappedExpense && mappedExpense.amount) {
				mappedExpense.amount += expense.amount;
			}
			else {
				mappedData.push({...expense})
			}
		})
		return mappedData;
	}
}