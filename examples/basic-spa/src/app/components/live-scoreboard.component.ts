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
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

export interface ParkStatus {
  id: string;
  name: string;
  occupancy: number;
  waitMinutes: number;
  lightsOn: boolean;
}

interface LiveScoreboardFields {
  Heading?: TextField;
  Intro?: TextField;
  PollIntervalSeconds?: TextField;
  Endpoint?: TextField;
}

const MOCK_PARKS = [
  { id: 'warehouse', name: 'Warehouse' },
  { id: 'school', name: 'School' },
  { id: 'mall', name: 'The Mall' },
  { id: 'chicago', name: 'Chicago' },
  { id: 'downtown', name: 'Downtown' },
  { id: 'downhill-jam', name: 'Downhill Jam' },
  { id: 'burnside', name: 'Burnside' },
  { id: 'streets', name: 'Streets' },
  { id: 'roswell', name: 'Roswell' },
  { id: 'hangar', name: 'The Hangar' },
  { id: 'school-ii', name: 'School II' },
  { id: 'marseille', name: 'Marseille' },
  { id: 'nyc', name: 'NY City' },
  { id: 'venice', name: 'Venice Beach' },
  { id: 'skatestreet', name: 'Skatestreet' },
  { id: 'philadelphia', name: 'Philadelphia' },
  { id: 'bullring', name: 'Bullring' },
  { id: 'chopper-drop', name: 'Chopper Drop' },
  { id: 'skate-heaven', name: 'Skate Heaven' },
];

function mockStatuses(): ParkStatus[] {
  return MOCK_PARKS.map((park) => ({
    ...park,
    occupancy: 20 + Math.floor(Math.random() * 75),
    waitMinutes: Math.floor(Math.random() * 18),
    lightsOn: Math.random() > 0.35,
  }));
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

  readonly parks = signal<ParkStatus[]>(mockStatuses());
  readonly lastUpdated = signal('');
  readonly error = signal('');

  readonly headingField = computed(() => (this.fields() as LiveScoreboardFields).Heading);
  readonly introField = computed(() => (this.fields() as LiveScoreboardFields).Intro);
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
        Number(sitecoreFieldValue((this.fields() as LiveScoreboardFields).PollIntervalSeconds)) || 8;
      const endpoint = sitecoreFieldValue((this.fields() as LiveScoreboardFields).Endpoint).trim();

      this.poll = interval(Math.max(seconds, 3) * 1000)
        .pipe(
          startWith(0),
          switchMap(() => {
            if (!endpoint) {
              return of(mockStatuses());
            }
            return this.http.get<ParkStatus[]>(endpoint).pipe(
              catchError(() => {
                this.error.set('Live feed unavailable — showing simulated occupancy.');
                return of(mockStatuses());
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
