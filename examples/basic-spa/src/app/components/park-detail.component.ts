import { Component, computed, inject, input } from '@angular/core';
import {
  ComponentRendering,
  ScImageDirective,
  ScRichTextDirective,
  ScTextDirective,
  SitecoreContextService,
} from '@sitecore-content-sdk/angular';
import { itemField, linkedItems, linkedLabel } from '../lib/sitecore-field';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

/**
 * Renders a single Park page.
 *
 * Unlike the other components this one has no datasource - it reads the fields of the
 * route item itself, so every Park page gets its detail view purely from the Page Design
 * without an editor wiring up a datasource per page.
 */
@Component({
  selector: 'app-park-detail',
  imports: [ScTextDirective, ScRichTextDirective, ScImageDirective],
  template: `
    <article class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content park-detail">
        <header class="park-detail__header">
          <h1 class="park-detail__title" *scText="field('Title')"></h1>
          <p class="park-detail__meta">
            <span class="park-detail__city">{{ city() }}</span>
            @if (city() && difficulty()) {
              <span class="park-detail__sep" aria-hidden="true">·</span>
            }
            @if (difficulty()) {
              <span class="park-detail__difficulty">{{ difficulty() }}</span>
            }
          </p>
        </header>

        @if (hasImage()) {
          <img class="park-detail__hero" *scImage="field('HeroImage')" />
        }

        @if (summary()) {
          <p class="park-detail__summary">{{ summary() }}</p>
        }

        <dl class="park-detail__facts">
          @if (hours()) {
            <div><dt>Hours</dt><dd>{{ hours() }}</dd></div>
          }
          @if (capacity()) {
            <div><dt>Capacity</dt><dd>{{ capacity() }} riders</dd></div>
          }
          @if (features().length) {
            <div>
              <dt>Features</dt>
              <dd>
                <ul class="park-detail__tags">
                  @for (feature of features(); track feature) {
                    <li>{{ feature }}</li>
                  }
                </ul>
              </dd>
            </div>
          }
        </dl>

        <div class="park-detail__body" *scRichText="field('Description')"></div>
      </div>
    </article>
  `,
})
export class ParkDetailComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  private readonly context = inject(SitecoreContextService);

  /** Fields of the route item, i.e. the Park page currently being rendered. */
  private readonly routeFields = computed<Record<string, unknown>>(
    () =>
      (this.context.page()?.layout?.sitecore?.route?.fields as Record<string, unknown>) ?? {}
  );

  /** Exposed to the template so `*scText` / `*scRichText` keep inline editing working. */
  field(name: string): unknown {
    return this.routeFields()[name];
  }

  readonly city = computed(() => this.text('City'));
  readonly hours = computed(() => this.text('Hours'));
  readonly summary = computed(() => this.text('Summary'));
  readonly capacity = computed(() => this.text('Capacity'));
  readonly difficulty = computed(() => linkedLabel(this.routeFields()['Difficulty']));
  readonly features = computed(() =>
    linkedItems(this.routeFields()['Features'])
      .map((feature) => linkedLabel(feature))
      .filter(Boolean)
  );
  readonly hasImage = computed(() => {
    const image = this.routeFields()['HeroImage'] as { value?: { src?: string } } | undefined;
    return Boolean(image?.value?.src);
  });

  readonly componentClass = computed(() =>
    sxaComponentClass('component park-detail', this.params())
  );
  readonly renderingId = computed(() => sxaRenderingId(this.params()));

  private text(name: string): string {
    return itemField({ id: '', fields: this.routeFields() }, name);
  }
}

export default ParkDetailComponent;
export { ParkDetailComponent as Default };
export { ParkDetailComponent as ParkDetail };
export { ParkDetailComponent as CSSStyles };
