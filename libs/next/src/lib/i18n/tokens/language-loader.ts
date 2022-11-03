import { InjectionToken } from '@angular/core';
import { PrizmLanguageLoader } from '../interfaces';

// @note: cannot be transferred to a shared file
// ReferenceError: Cannot access 'PZM_LANGUAGE_LOADER' before initialization
export const PZM_LANGUAGE_LOADER = new InjectionToken<PrizmLanguageLoader>(
    `Webpack chunk loader for Zyfra UI libraries i18n`,
);
