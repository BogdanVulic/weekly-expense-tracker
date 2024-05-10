import { Component, EventEmitter, Output } from '@angular/core';
import { Days } from '../models/days.enum';
import { DaySelectionService } from '../services/days-selection.service';
import { NgClass } from '@angular/common';
import { ScrollHorizontalDirective } from '../scroll-horizontal.directive';

@Component({
	selector: 'app-tabs',
	standalone: true,
	imports: [NgClass, ScrollHorizontalDirective],
	templateUrl: './tabs.component.html',
	styleUrl: './tabs.component.scss'
})
export class TabsComponent {

	days!: string[]
	selectedDay!: string;

	constructor(
		public daysSelectionService: DaySelectionService
	) {
		this.daysSelectionService.selectedDay.subscribe(day => {
			this.selectedDay = day;
		})
		this.days = this.daysSelectionService.days;
	}

	selectDay(day: string): void {
		this.daysSelectionService.selectedDay = day
	}
}
