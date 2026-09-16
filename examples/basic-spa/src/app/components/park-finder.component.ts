import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRendering,
  ScRichTextDirective,
  ScTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { parseJsonArray, sitecoreFieldValue } from '../lib/sitecore-field';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

export interface Park {
  id: string;
  name: string;
  city: string;
  difficulty: string;
  features: string[];
  hours: string;
}

interface ParkFinderFields {
  Heading?: TextField;
  Intro?: TextField;
  ParksJson?: TextField;
}

const FALLBACK_PARKS: Park[] = [
  {
    id: 'burnside',
    name: 'Burnside',
    city: 'Portland',
    difficulty: 'Advanced',
    features: ['Bowl', 'DIY'],
    hours: 'Dawn – dusk',
  },
  {
    id: 'venice',
    name: 'Venice Beach Skatepark',
    city: 'Los Angeles',
    difficulty: 'Intermediate',
    features: ['Bowl', 'Street', 'Lights'],
    hours: '6am – 10pm',
  },
];

@Component({
  selector: 'app-park-finder',
  imports: [FormsModule, TranslatePipe, ScTextDirective, ScRichTextDirective],
  template: `
    <section class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content park-finder">
        <h1 class="park-finder__title" *scText="headingField()"></h1>
        <div class="park-finder__intro" *scRichText="introField()"></div>

        <form class="park-finder__filters" (submit)="$event.preventDefault()">
          <label>
            <span>{{ 'parkfinder.filter' | translate }}</span>
            <input
              type="search"
              name="q"
              [ngModel]="query()"
              (ngModelChange)="onQuery($event)"
              placeholder="Search parks"
            />
          </label>
          <label>
            <span>{{ 'parkfinder.allCities' | translate }}</span>
            <select [ngModel]="city()" (ngModelChange)="onCity($event)" name="city">
              <option value="">{{ 'parkfinder.allCities' | translate }}</option>
              @for (option of cities(); track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
          <label>
            <span>Difficulty</span>
            <select [ngModel]="difficulty()" (ngModelChange)="onDifficulty($event)" name="difficulty">
              <option value="">All levels</option>
              @for (option of difficulties(); track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
        </form>

        <p class="park-finder__count">{{ filtered().length }} parks</p>

        <ul class="park-finder__grid">
          @for (park of filtered(); track park.id) {
            <li class="park-card">
              <h2>{{ park.name }}</h2>
              <p>{{ park.city }} · {{ park.difficulty }}</p>
              <p class="park-card__hours">{{ park.hours }}</p>
              <ul class="park-card__tags">
                @for (feature of park.features; track feature) {
                  <li>{{ feature }}</li>
                }
              </ul>
            </li>
          } @empty {
            <li class="park-finder__empty">No parks match those filters.</li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class ParkFinderComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly query = signal('');
  readonly city = signal('');
  readonly difficulty = signal('');

  readonly headingField = computed(() => (this.fields() as ParkFinderFields).Heading);
  readonly introField = computed(() => (this.fields() as ParkFinderFields).Intro);
  readonly parks = computed(() => {
    const parsed = parseJsonArray<Park>(sitecoreFieldValue((this.fields() as ParkFinderFields).ParksJson));
    return parsed.length ? parsed : FALLBACK_PARKS;
  });
  readonly cities = computed(() => [...new Set(this.parks().map((park) => park.city))].sort());
  readonly difficulties = computed(() =>
    [...new Set(this.parks().map((park) => park.difficulty))].sort()
  );
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const city = this.city();
    const difficulty = this.difficulty();
    return this.parks().filter((park) => {
      const matchesQuery =
        !q ||
        park.name.toLowerCase().includes(q) ||
        park.city.toLowerCase().includes(q) ||
        park.features.some((feature) => feature.toLowerCase().includes(q));
      return matchesQuery && (!city || park.city === city) && (!difficulty || park.difficulty === difficulty);
    });
  });
  readonly componentClass = computed(() => sxaComponentClass('component park-finder', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));

  constructor() {
    effect(() => {
      const params = this.route.snapshot.queryParamMap;
      this.city.set(params.get('city') ?? '');
      this.difficulty.set(params.get('difficulty') ?? '');
      this.query.set(params.get('q') ?? '');
    });
  }

  onQuery(value: string): void {
    this.query.set(value);
    this.syncUrl();
  }

  onCity(value: string): void {
    this.city.set(value);
    this.syncUrl();
  }

  onDifficulty(value: string): void {
    this.difficulty.set(value);
    this.syncUrl();
  }

  private syncUrl(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        city: this.city() || null,
        difficulty: this.difficulty() || null,
        q: this.query() || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

export default ParkFinderComponent;
export { ParkFinderComponent as Default };
export { ParkFinderComponent as ParkFinder };
export { ParkFinderComponent as CSSStyles };
