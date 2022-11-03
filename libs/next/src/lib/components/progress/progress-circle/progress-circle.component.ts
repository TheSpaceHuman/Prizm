import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Inject, Input, ViewChild } from '@angular/core';
import { USER_AGENT, WINDOW } from '@ng-web-apis/common';
import { pzmDefaultProp } from '../../../decorators/default-prop';
import { PZM_CHROMIUM_EDGE_START_VERSION } from '../../../constants/chromium';
import { PrizmSizeS, PrizmSizesXl } from '../../../util/size-bigger';
import { pzmIsEdgeOlderThan } from '../../../util/browser/is-edge-older-than';

@Component({
    selector: `pzm-progress-circle`,
    templateUrl: `./progress-circle.component.html`,
    styleUrls: [`./progress-circle.component.less`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizmProgressCircleComponent {
    @ViewChild(`progressCircle`, {static: true})
    private readonly progressCircle!: ElementRef<SVGCircleElement>;

    @Input()
    @pzmDefaultProp()
    value = 0;

    @Input()
    @pzmDefaultProp()
    max = 1;

    @Input()
    @HostBinding(`style.--pzm-progress-color`)
    @pzmDefaultProp()
    color: string | null = null;

    @Input()
    @HostBinding(`style.--pzm-progress-circle-track-color`)
    @pzmDefaultProp()
    trackColor: string | null = null;

    @Input()
    @HostBinding(`attr.data-size`)
    @pzmDefaultProp()
    size: PrizmSizeS | PrizmSizesXl = `m`;

    @HostBinding(`style.--progress-percentage`)
    get progressPercentage(): number {
        return this.value / this.max;
    }

    // TODO: drop support of legacy Edge (EdgeHTML) in v4.x
    get oldEdgeRadiusFallback(): number | null {
        if (!pzmIsEdgeOlderThan(PZM_CHROMIUM_EDGE_START_VERSION, this.userAgent)) {
            return null;
        }

        const strokeWidth = parseInt(
            this.windowRef.getComputedStyle(this.progressCircle.nativeElement)
                .strokeWidth,
            10,
        );

        return (this.elementRef.nativeElement.offsetWidth - strokeWidth) / 2;
    }

    constructor(
        @Inject(USER_AGENT) private readonly userAgent: string,
        @Inject(WINDOW) private readonly windowRef: Window,
        @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>,
    ) {}
}
