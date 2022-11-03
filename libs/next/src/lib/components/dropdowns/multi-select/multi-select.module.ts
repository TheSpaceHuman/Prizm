import { NgModule } from '@angular/core';
import { PrizmMultiSelectComponent } from './multi-select.component';
import { PrizmOverlayModule } from '../../../modules/overlay';
import { PolymorphModule, PrizmAutoFocusModule } from '../../../directives';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrizmDataListModule } from '../../data-list';
import { PrizmDropdownHostModule } from '../dropdown-host';
import { PrizmScrollbarModule } from '../../scrollbar';
import { PrizmDropdownControllerModule } from '../../../directives/dropdown-controller';
import { PrizmChipsModule } from '../../chips';
import { PrizmInputTextModule } from '../../input/input-text/input-text.module';
import { PrizmCallFuncModule, PrizmLetModule } from '@digital-plant/zyfra-helpers';
import { PrizmHintModule } from '../../../directives/hint';
import { PrizmIconModule } from '../../icon';
import { PrizmCheckboxModule } from '../../checkbox';

@NgModule({
    imports: [
      PrizmOverlayModule,
      PolymorphModule,
      PrizmInputTextModule,
      PrizmChipsModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      PrizmLetModule,
      PrizmHintModule,
      PrizmIconModule,
      PrizmCallFuncModule,
      PrizmAutoFocusModule,
      PrizmScrollbarModule,
      PrizmDropdownControllerModule,
      PrizmDataListModule,
      PrizmCheckboxModule,
      PrizmDropdownHostModule
    ],
    declarations: [PrizmMultiSelectComponent],
    exports: [PrizmMultiSelectComponent],
})
export class PrizmMultiSelectModule {}
