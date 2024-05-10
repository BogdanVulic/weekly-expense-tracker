import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[appScrollHorizontal]',
	standalone: true
})
export class ScrollHorizontalDirective {

	constructor(private el: ElementRef) { }

	@HostListener('wheel', ['$event'])
	onWheel(event: WheelEvent) {
		event.preventDefault();
		this.el.nativeElement.scrollBy({ left: event.deltaY, behavior: 'smooth' });
	}

}
