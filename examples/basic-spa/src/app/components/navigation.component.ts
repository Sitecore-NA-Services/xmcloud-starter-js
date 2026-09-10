import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentRendering } from '@sitecore-content-sdk/angular';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

interface TextLike {
  value?: string;
}

export interface NavigationItem {
  Id?: string;
  DisplayName?: string;
  Title?: TextLike | string;
  NavigationTitle?: TextLike | string;
  Href?: string;
  Querystring?: string;
  Children?: NavigationItem[];
  Styles?: string[];
}

function fieldText(field: TextLike | string | undefined): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field.value ?? '';
}

function itemLabel(item: NavigationItem): string {
  return fieldText(item.NavigationTitle) || fieldText(item.Title) || item.DisplayName || '';
}

function itemHref(item: NavigationItem): string {
  const href = item.Href || '/';
  const qs = item.Querystring?.replace(/^\?/, '');
  if (!qs) return href;
  return href.includes('?') ? `${href}&${qs}` : `${href}?${qs}`;
}

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|\/\/)/i.test(href);
}

@Component({
  selector: 'li[app-navigation-list-item]',
  imports: [RouterLink],
  host: {
    '[class]': 'itemClass()',
    tabindex: '0',
  },
  template: `
    <div class="navigation-title" [class.child]="hasChildren()" (click)="toggleActive()">
      @if (external()) {
        <a [href]="href()" [title]="label()">{{ label() }}</a>
      } @else {
        <a [routerLink]="href()" [title]="label()">{{ label() }}</a>
      }
    </div>
    @if (hasChildren()) {
      <ul class="clearfix">
        @for (child of children(); track child.Id || $index) {
          <li app-navigation-list-item [item]="child" [relativeLevel]="relativeLevel() + 1"></li>
        }
      </ul>
    }
  `,
})
export class NavigationListItemComponent {
  readonly item = input.required<NavigationItem>();
  readonly relativeLevel = input(1);

  readonly isActive = signal(false);
  readonly label = computed(() => itemLabel(this.item()));
  readonly href = computed(() => itemHref(this.item()));
  readonly external = computed(() => isExternalHref(this.href()));
  readonly children = computed(() => this.item().Children ?? []);
  readonly hasChildren = computed(() => this.children().length > 0);
  readonly itemClass = computed(() =>
    [...(this.item().Styles ?? []), `rel-level${this.relativeLevel()}`, this.isActive() ? 'active' : '']
      .filter(Boolean)
      .join(' ')
  );

  toggleActive(): void {
    if (this.hasChildren()) {
      this.isActive.update((open) => !open);
    }
  }
}

@Component({
  selector: 'app-navigation',
  imports: [NavigationListItemComponent],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      @if (items().length === 0) {
        <div class="component-content">[Navigation]</div>
      } @else {
        <label class="menu-mobile-navigate-wrapper">
          <input
            type="checkbox"
            class="menu-mobile-navigate"
            [checked]="menuOpen()"
            (change)="menuOpen.set(!menuOpen())"
          />
          <div class="menu-humburger"></div>
          <div class="component-content">
            <nav>
              <ul class="clearfix">
                @for (item of items(); track item.Id || $index) {
                  <li app-navigation-list-item [item]="item" [relativeLevel]="1"></li>
                }
              </ul>
            </nav>
          </div>
        </label>
      }
    </div>
  `,
})
export class NavigationComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly menuOpen = signal(false);
  readonly componentClass = computed(() => sxaComponentClass('component navigation', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
  readonly items = computed(() =>
    Object.values(this.fields()).filter((value): value is NavigationItem => !!value && typeof value === 'object')
  );
}

export default NavigationComponent;
export { NavigationComponent as Default };
