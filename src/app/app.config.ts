import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
	providers: [
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withFetch()),
		importProvidersFrom(NgbModule)
	]
};
