import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRendering,
  ScRichTextDirective,
  ScTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { Subscription, catchError, interval, of, startWith, switchMap } from 'rxjs';
import { sitecoreFieldValue } from '../lib/sitecore-field';
import { toParks, type Park } from '../lib/park';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

export interface ParkStatus {
  id: string;
  name: string;
  url: string;
  capacity: number;
  occupancy: number;
  waitMinutes: number;
  lightsOn: boolean;
}

interface LiveScoreboardFields {
  Heading?: TextField;
  Intro?: TextField;
  PollIntervalSeconds?: TextField;
  Endpoint?: TextField;
  /** Multilist of Park pages - the roster the board reports on. */
  Parks?: unknown;
}

/**
 * Seed a board row from a Sitecore Park item. Occupancy is derived from the park id so a
 * reload starts from the same place rather than jumping, then drifts per tick. Capacity and
 * lights come from authored content; only the live number is simulated.
 */
function seedStatus(park: Park): ParkStatus {
  let hash = 0;
  for (const ch of park.id) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  }
  const occupancy = OCCUPANCY_MIN + (hash % (OCCUPANCY_MAX - OCCUPANCY_MIN));
  return {
    id: park.id,
    name: park.name,
    url: park.url,
    capacity: park.capacity,
    occupancy,
    waitMinutes: waitForOccupancy(occupancy),
    lightsOn: park.features.includes('Lights'),
  };
}
const OCCUPANCY_MIN = 28;
const OCCUPANCY_MAX = 91;
const DRIFT_RANGE = 2;

function waitForOccupancy(occupancy: number): number {
  if (occupancy >= 85) {
    return 10 + Math.floor((occupancy - 85) / 2);
  }
  if (occupancy >= 70) {
    return 5 + Math.floor((occupancy - 70) / 4);
  }
  if (occupancy >= 50) {
    return 1 + Math.floor((occupancy - 50) / 10);
  }
  return 0;
}

function cloneStatuses(rows: ParkStatus[]): ParkStatus[] {
  return rows.map((park) => ({ ...park }));
}

let sessionStatuses: ParkStatus[] = [];

/** Drift each row a little, keeping the roster itself content-driven. */
function mockStatuses(seed: ParkStatus[]): ParkStatus[] {
  if (sessionStatuses.length !== seed.length) {
    sessionStatuses = cloneStatuses(seed);
  }
  sessionStatuses = sessionStatuses.map((park) => {
    const drift = Math.floor(Math.random() * (DRIFT_RANGE * 2 + 1)) - DRIFT_RANGE;
    const occupancy = Math.min(OCCUPANCY_MAX, Math.max(OCCUPANCY_MIN, park.occupancy + drift));
    return {
      ...park,
      occupancy,
      waitMinutes: waitForOccupancy(occupancy),
    };
  });
  return cloneStatuses(sessionStatuses);
}

@Component({
  selector: 'app-live-scoreboard',
  imports: [TranslatePipe, ScTextDirective, ScRichTextDirective],
  template: `
    <section class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content live-scoreboard">
        <header class="live-scoreboard__header">
          <div>
            <h1 *scText="headingField()"></h1>
            <div *scRichText="introField()"></div>
          </div>
          <p class="live-scoreboard__stamp">
            {{ 'live.updated' | translate }}
            {{ lastUpdated() || '—' }}
          </p>
        </header>

        @if (error()) {
          <p class="live-scoreboard__error">{{ error() }}</p>
        }

        <ul class="live-scoreboard__grid">
          @for (park of parks(); track park.id) {
            <li [class.busy]="park.occupancy >= 80">
              <h2>{{ park.name }}</h2>
              <p class="live-scoreboard__occupancy">{{ park.occupancy }}% full</p>
              <p>{{ park.occupancy >= 80 ? 'Packed session' : 'Session open' }}</p>
              <p>Wait {{ park.waitMinutes }} min · {{ park.lightsOn ? 'Lights on' : 'Daylight only' }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class LiveScoreboardComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private poll?: Subscription;

  readonly parks = signal<ParkStatus[]>([]);
  readonly lastUpdated = signal('');
  readonly error = signal('');

  readonly headingField = computed(() => (this.fields() as LiveScoreboardFields).Heading);
  readonly introField = computed(() => (this.fields() as LiveScoreboardFields).Intro);
  /** Roster comes from the datasource's Multilist of Park pages. */
  readonly seed = computed(() =>
    toParks((this.fields() as LiveScoreboardFields).Parks).map(seedStatus)
  );
  readonly componentClass = computed(() =>
    sxaComponentClass('component live-scoreboard', this.params())
  );
  readonly renderingId = computed(() => sxaRenderingId(this.params()));

  constructor() {
    effect(() => {
      if (!this.isBrowser || this.poll) {
        return;
      }
      const seconds =
        Number(sitecoreFieldValue((this.fields() as LiveScoreboardFields).PollIntervalSeconds)) || 15;
      const endpoint = sitecoreFieldValue((this.fields() as LiveScoreboardFields).Endpoint).trim();

      this.poll = interval(Math.max(seconds, 3) * 1000)
        .pipe(
          startWith(0),
          switchMap(() => {
            if (!endpoint) {
              return of(mockStatuses(this.seed()));
            }
            return this.http.get<ParkStatus[]>(endpoint).pipe(
              catchError(() => {
                this.error.set('Live feed unavailable — showing simulated occupancy.');
                return of(mockStatuses(this.seed()));
              })
            );
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((rows) => {
          this.parks.set(rows);
          this.lastUpdated.set(new Date().toLocaleTimeString());
        });
    });
  }
}

export default LiveScoreboardComponent;
export { LiveScoreboardComponent as Default };
export { LiveScoreboardComponent as LiveScoreboard };
export { LiveScoreboardComponent as CSSStyles };
