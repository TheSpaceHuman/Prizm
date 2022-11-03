import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrizmSelectIdentityMatcher, PrizmSelectSearchMatcher, PrizmSelectStringify } from '@digital-plant/zui-components';
import { tap } from 'rxjs/operators';

type PrizmItem = {
  id: number;
  name: string;
}
@Component({
  selector: 'pzm-select-with-object-example',
  templateUrl: './select-with-object-example.component.html',
  styles: [`
    .item {
      display: flex;
      gap: .5rem;
    }
  `]
})
export class PrizmSelectWithObjectExampleComponent {
  readonly items: PrizmItem[] = [
    {id: 1, name: 'Россия'},
    {id: 2, name: 'США'},
    {id: 3, name: 'ОАЭ'},
  ];
  readonly valueControl = new FormControl({id: 3});

  readonly searchMatcher: PrizmSelectSearchMatcher<PrizmItem> = (search: string, item: PrizmItem) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  };

  readonly identityMatcher: PrizmSelectIdentityMatcher<PrizmItem> = (a: PrizmItem, b: PrizmItem) => {
    return a.id === b.id;
  }

  readonly stringify: PrizmSelectStringify<PrizmItem> = (item: PrizmItem) => {
    return item.name;
  }

  public setDefaultValue(): void {
    this.valueControl.setValue(this.items[0]);
  }
}
