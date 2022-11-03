import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { RouterModule } from '@angular/router';
import {
  PolymorphModule,
  PrizmButtonModule,
  PrizmDialogModule,
  PrizmRadioButtonModule,
} from '@digital-plant/zui-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './dialog.component';
import { PrizmDialogServiceExampleComponent } from './examples/base/base.component';

@NgModule({
  imports: [
    CommonModule,
    TuiAddonDocModule,
    FormsModule,
    ReactiveFormsModule,
    PolymorphModule,
    PrizmButtonModule,
    PrizmDialogModule,
    PrizmRadioButtonModule,
    RouterModule.forChild(generateRoutes(DialogComponent)),
  ],
  declarations: [
    PrizmDialogServiceExampleComponent,
    DialogComponent
  ],
  exports: [DialogComponent],
})
export class DialogModule {}
