import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Days } from '../models/days.enum';

@Injectable({
	providedIn: 'root'
})
export class DaySelectionService {
	
	public days: string[] = Object.keys(Days).slice(Object.keys(Days).length / 2);

	constructor() { }

	private _selectedDay: BehaviorSubject<string> = new BehaviorSubject<string>('MONDAY');

	get selectedDay(): Observable<string> {
		return this._selectedDay;
	}

	set selectedDay(day: string) {
		this._selectedDay.next(day);
	}

	get getDays(): String[] {
		return this.days;
	}
}
