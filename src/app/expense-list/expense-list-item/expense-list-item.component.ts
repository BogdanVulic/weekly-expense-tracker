import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Expense } from '../../models/expense.interface';

@Component({
  selector: 'app-expense-list-item',
  standalone: true,
  imports: [],
  templateUrl: './expense-list-item.component.html',
  styleUrl: './expense-list-item.component.scss'
})
export class ExpenseListItemComponent {

	@Input() selectedDay!: string;
	@Input() expense!: Expense;
	@Output() delete: EventEmitter<string> = new EventEmitter<string>();
	@Output() edit: EventEmitter<string> = new EventEmitter<string>();

}
