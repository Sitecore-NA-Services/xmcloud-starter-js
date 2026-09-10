import { Component, computed, input } from '@angular/core';
import {
  ComponentRendering,
  ImageField,
  LinkField,
  ScImageDirective,
  ScLinkDirective,
  ScRichTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

interface PromoFields {
  PromoIcon?: ImageField;
  PromoText?: TextField;
  PromoLink?: LinkField;
  PromoText2?: TextField;
}

@Component({
  selector: 'app-promo',
  imports: [ScImageDirective, ScLinkDirective, ScRichTextDirective],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content">
        @if (hasFields()) {
          <div class="field-promoicon">
            <img *scImage="iconField()" />
          </div>
          <div class="promo-text">
            <div class="field-promotext" *scRichText="textField()"></div>
            <div class="field-promolink">
              <a *scLink="linkField()"></a>
            </div>
          </div>
        } @else {
          <span class="is-empty-hint">Promo</span>
        }
      </div>
    </div>
  `,
})
export class PromoComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly promoFields = computed(() => this.fields() as PromoFields);
  readonly hasFields = computed(() => Object.keys(this.fields() || {}).length > 0);
  readonly iconField = computed(() => this.promoFields().PromoIcon);
  readonly textField = computed(() => this.promoFields().PromoText);
  readonly linkField = computed(() => this.promoFields().PromoLink);
  readonly componentClass = computed(() => sxaComponentClass('component promo', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
}

@Component({
  selector: 'app-promo-with-text',
  imports: [ScImageDirective, ScRichTextDirective],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content">
        @if (hasFields()) {
          <div class="field-promoicon">
            <img *scImage="iconField()" />
          </div>
          <div class="promo-text">
            <div class="field-promotext promo-text" *scRichText="textField()"></div>
            <div class="field-promotext promo-text" *scRichText="text2Field()"></div>
          </div>
        } @else {
          <span class="is-empty-hint">Promo</span>
        }
      </div>
    </div>
  `,
})
export class PromoWithTextComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly promoFields = computed(() => this.fields() as PromoFields);
  readonly hasFields = computed(() => Object.keys(this.fields() || {}).length > 0);
  readonly iconField = computed(() => this.promoFields().PromoIcon);
  readonly textField = computed(() => this.promoFields().PromoText);
  readonly text2Field = computed(() => this.promoFields().PromoText2);
  readonly componentClass = computed(() => sxaComponentClass('component promo', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
}

export default PromoComponent;
export { PromoComponent as Default, PromoWithTextComponent as WithText };
