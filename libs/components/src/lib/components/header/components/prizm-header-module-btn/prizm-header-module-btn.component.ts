import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IndicatorStatus } from '../../../indicator/indicator.models';
import { CommonModule } from '@angular/common';
import { PrizmButtonComponent } from '../../../button';
import { PrizmHintDirective } from '../../../../directives';

@Component({
  selector: 'prizm-header-module-btn',
  templateUrl: './prizm-header-module-btn.component.html',
  styleUrls: ['./prizm-header-module-btn.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PrizmButtonComponent, PrizmHintDirective],
})
export class PrizmHeaderModuleBtnComponent {
  @Input() public icon = 'bell';
  @Input() public alertsCount = 0;
  @Input() public title = '';
  @Input() public status: IndicatorStatus = 'info';
}
