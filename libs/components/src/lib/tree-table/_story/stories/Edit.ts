import { Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { getFileSystem } from '../data';
import { ZyfraTreeTableComponent } from '../../tree-table.component';
import { consoleLogAction } from '../../../../../.storybook/helpers';

const actions = {
  onNodeExpand: action('onNodeExpand'),
  onNodeCollapse: action('onNodeCollapse'),
};

const Template: Story<ZyfraTreeTableComponent> = args => ({
  template: `
    <zyfra-tree-table
      [value]="value"
      [columns]="columns"
      [title]="title"
      (editInit)="editInit($event)"
      (editComplete)="onEditComplete($event)"
      (editCancel)="onEditCancel($event)"
      (onNodeExpand)="onNodeExpand($event)"
      (onNodeCollapse)="onNodeCollapse($event)"
    >
      <ng-template zyfraTableTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns">{{ col.header }}</th>
        </tr>
      </ng-template>

      <ng-template zyfraTableTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
        <tr [zyfraRow]="rowData" [zyfraTTRow]="rowNode">
          <td
            *ngFor="let col of columns; let i = index"
            zyfraTTEditableColumn
          >
            <zyfra-tree-table-toggler [rowNode]="rowNode" *ngIf="i === 0"></zyfra-tree-table-toggler>

            <zyfra-tree-table-cell-editor [(value)]="rowData[col.field]">
              {{ rowData[col.field] }}
            </zyfra-tree-table-cell-editor>
          </td>
        </tr>
      </ng-template>
    </zyfra-tree-table>
  `,
  props: {
    ...args,
    editInit: consoleLogAction('editInit'),
    editComplete: consoleLogAction('editComplete'),
    editCancel: consoleLogAction('editCancel'),
    onNodeExpand: (event): void => actions.onNodeExpand({ node: event.node, ...event }),
    onNodeCollapse: (event): void => actions.onNodeCollapse({ node: event.node, ...event }),
  },
});

export const Edit = Template.bind({});

Edit.args = {
  title: 'Таблица с редактированием ячеек',
  value: getFileSystem(),
  columns: [
    { field: 'name', header: 'Name' },
    { field: 'size', header: 'Size' },
    { field: 'type', header: 'Type' },
  ],
};
