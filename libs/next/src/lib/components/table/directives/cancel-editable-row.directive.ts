import { Directive } from '@angular/core';
import { CancelEditableRow } from 'primeng/table';

@Directive({
  selector: '[pzmCancelEditableRow]',
})
export class PrizmCancelEditableRowDirective extends CancelEditableRow {}
