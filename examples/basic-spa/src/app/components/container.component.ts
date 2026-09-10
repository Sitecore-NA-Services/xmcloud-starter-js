import { Component, computed, input } from '@angular/core';
import { ComponentRendering, ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { sxaComponentClass, sxaRenderingId, sxaStyles, type SxaParams } from './sxa-params';

const MEDIA_URL_PATTERN = /mediaurl="([^"]*)"/i;

@Component({
  selector: 'app-container',
  imports: [ScPlaceholderComponent],
  template: `
    <div [class.container-wrapper]="wrapInContainer()">
      <div class="{{ componentClass() }}" [attr.id]="renderingId()">
        <div class="component-content" [style.background-image]="backgroundImage()">
          <div class="row">
            @if (rendering(); as renderingValue) {
              <sc-placeholder
                class="row"
                [name]="placeholderName()"
                [rendering]="renderingValue"
              ></sc-placeholder>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContainerComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly componentClass = computed(() =>
    sxaComponentClass('component container-default', this.params())
  );
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
  readonly wrapInContainer = computed(() => sxaStyles(this.params()).split(/\s+/).includes('container'));
  readonly placeholderName = computed(() => {
    const id = this.params().DynamicPlaceholderId || this.rendering()?.params?.DynamicPlaceholderId;
    return id ? `container-${id}` : 'container';
  });
  readonly backgroundImage = computed(() => {
    const raw = this.params().BackgroundImage || this.rendering()?.params?.BackgroundImage;
    if (!raw) return undefined;
    const match = raw.match(MEDIA_URL_PATTERN);
    const url = match?.[1];
    return url ? `url('${url}')` : undefined;
  });
}

export default ContainerComponent;
export { ContainerComponent as Default };
