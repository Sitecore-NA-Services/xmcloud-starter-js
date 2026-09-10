import { Component, computed, inject, input } from '@angular/core';
import {
  ComponentRendering,
  ImageField,
  LinkField,
  ScImageDirective,
  ScLinkDirective,
  ScTextDirective,
  SitecoreContextService,
  TextField,
} from '@sitecore-content-sdk/angular';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

interface ImageFields {
  Image?: ImageField;
  ImageCaption?: TextField;
  TargetUrl?: LinkField;
}

@Component({
  selector: 'app-image',
  imports: [ScImageDirective, ScLinkDirective, ScTextDirective],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content">
        @if (imageField()) {
          @if (wrapWithLink()) {
            <a *scLink="targetUrl()">
              <img *scImage="imageField()" />
            </a>
          } @else {
            <img *scImage="imageField()" />
          }
          <span class="image-caption field-imagecaption" *scText="captionField()"></span>
        } @else {
          <span class="is-empty-hint">Image</span>
        }
      </div>
    </div>
  `,
})
export class ImageComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  private readonly context = inject(SitecoreContextService, { optional: true });

  readonly imageFields = computed(() => this.fields() as ImageFields);
  readonly imageField = computed(() => this.imageFields().Image);
  readonly captionField = computed(() => this.imageFields().ImageCaption);
  readonly targetUrl = computed(() => this.imageFields().TargetUrl);
  readonly wrapWithLink = computed(() => {
    const href = this.targetUrl()?.value?.href;
    return !!href && !this.context?.isEditing();
  });
  readonly componentClass = computed(() => sxaComponentClass('component image', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
}

@Component({
  selector: 'app-image-banner',
  imports: [ScImageDirective],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content sc-sxa-image-hero-banner">
        <img *scImage="imageField()" class="w-full h-full object-cover" />
      </div>
    </div>
  `,
})
export class ImageBannerComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly imageField = computed(() => (this.fields() as ImageFields).Image);
  readonly componentClass = computed(() => sxaComponentClass('component hero-banner', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
}

export default ImageComponent;
export { ImageComponent as Default, ImageBannerComponent as Banner };
