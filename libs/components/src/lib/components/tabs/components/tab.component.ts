import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { PrizmTabType } from '../tabs.interface';
import { PrizmTabsService } from '../tabs.service';
import { PolymorphContent } from '../../../directives';
import { combineLatest, fromEvent, merge, Observable, of, switchMap, timeout } from 'rxjs';
import {
  Compare,
  moveInEventLoopIteration,
  PrizmDestroyService,
  PrizmLetContextService,
} from '@prizm-ui/helpers';
import { PrizmTabContext, PrizmTabMenuContext } from '../tabs.model';
import { filter, first, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { PrizmAbstractTestId } from '../../../abstract/interactive';

@Component({
  selector: 'prizm-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PrizmDestroyService],
})
export class PrizmTabComponent extends PrizmAbstractTestId implements OnInit, OnDestroy {
  @Input() @HostBinding('attr.tab-type') public type: PrizmTabType = 'line';
  @Input() icon: PolymorphContent<PrizmTabContext> | null = null;
  @Input() content: PolymorphContent<PrizmTabContext> | null = null;
  @Input() closeIcon: PolymorphContent<PrizmTabContext> = 'cancel-close';
  @Input() count = 0;
  @Input() closable!: boolean;
  @Input() disabled = false;
  private idx_: number | null = null;
  public readonly idx$ = this.tabsService.tabs$.pipe(
    map(() => this.inMenuContextService?.context?.inMenuIdx ?? this.tabsService?.findTabIdx?.(this)),
    tap(idx => (this.idx_ = idx))
  );
  public get idx(): number | null {
    return this.idx_;
  }
  @Output() public closeTab = new EventEmitter<void>();

  private currentDomIdx!: number;
  override readonly testId_ = 'ui_tab';
  readonly isActiveTab$: Observable<boolean> = combineLatest([
    this.idx$,
    this.tabsService.activeTabIdx$,
  ]).pipe(map(([current, active]) => current === active));

  readonly tab$ = this.idx$.pipe(
    map(idx => (typeof idx === 'number' ? this.tabsService.getTabByIdx(idx) : this))
  );

  constructor(
    @Optional()
    private readonly inMenuContextService: PrizmLetContextService<PrizmTabMenuContext>,
    public readonly tabsService: PrizmTabsService,
    public readonly destroy: PrizmDestroyService,
    public readonly el: ElementRef<HTMLElement>
  ) {
    super();
  }

  public ngOnDestroy(): void {
    this.tab$
      .pipe(
        first(),
        tap(tab => {
          if (tab === this) this.tabsService.removeTab(tab);
        }),
        timeout(25)
      )
      .subscribe();
  }

  private isFromMenuTab(): boolean {
    return !!this.inMenuContextService?.context?.inMenuIdx;
  }

  private isMainProjectedTab(): boolean {
    return !this.isFromMenuTab();
  }

  private initUpdateIndexOnDomUpdateListener(): void {
    this.tabsService.removed$$
      .pipe(
        switchMap(() => this.tabsService.changeParent$),
        startWith(void 0),
        filter(() => this.isMainProjectedTab()),
        tap(() => {
          const currentDomIdx = Array.from(this.el.nativeElement.parentElement?.children ?? []).indexOf(
            this.el.nativeElement
          );
          if (Compare.isNotNullish(this.currentDomIdx) && currentDomIdx !== this.currentDomIdx) {
            this.tabsService.moveTab(this.currentDomIdx, currentDomIdx, this);
          } else {
            this.tabsService.updateTab(this, currentDomIdx);
          }
          this.currentDomIdx = currentDomIdx;
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  private initClickListenerToSelectTab(): void {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(
        switchMap(() => {
          if (this.disabled) return of(null);
          return this.selectTab$();
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.initUpdateIndexOnDomUpdateListener();
    this.initClickListenerToSelectTab();
  }

  public selectTab$(): Observable<unknown> {
    return this.tab$.pipe(
      first(),
      tap(tab => {
        this.tabsService?.selectTab(tab);
      })
    );
  }

  public onClose(event: MouseEvent): void {
    event.stopPropagation();
    this.tab$.pipe(
      first(),
      tap(tab => {
        tab.closeTab.emit();
      }),
      takeUntil(this.destroy)
    );

    this.closeTab.emit();
  }
}
