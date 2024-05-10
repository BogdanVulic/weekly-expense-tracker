import { TestBed } from '@angular/core/testing';

import { DaySelectionService } from './days-selection.service';

describe('DaysSelectionService', () => {
	let service: DaySelectionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DaySelectionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
