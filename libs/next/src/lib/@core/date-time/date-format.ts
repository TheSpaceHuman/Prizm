import { InjectionToken } from '@angular/core';
import { PrizmDateMode } from '../../types/date-mode';

export const PZM_DATE_FORMAT = new InjectionToken<PrizmDateMode>(
    `Active date format for Zyfra UI`,
    {
        factory: (): PrizmDateMode => `DMY`,
    },
);
