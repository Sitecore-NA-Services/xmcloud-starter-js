import { Component, computed, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRendering,
  ScRichTextDirective,
  ScTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { parseJsonArray, sitecoreFieldValue } from '../lib/sitecore-field';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

export interface Lesson {
  id: string;
  title: string;
  level: string;
  duration: number;
  price: number;
  coach: string;
}

interface LessonBookingFields {
  Heading?: TextField;
  Intro?: TextField;
  LessonsJson?: TextField;
}

const FALLBACK_LESSONS: Lesson[] = [
  {
    id: 'beginner-bowl',
    title: 'Beginner Bowl',
    level: 'Beginner',
    duration: 60,
    price: 45,
    coach: 'Maya Chen',
  },
];

@Component({
  selector: 'app-lesson-booking',
  imports: [ReactiveFormsModule, TranslatePipe, ScTextDirective, ScRichTextDirective],
  template: `
    <section class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content lesson-booking">
        <h1 class="lesson-booking__title" *scText="headingField()"></h1>
        <div class="lesson-booking__intro" *scRichText="introField()"></div>

        <ul class="lesson-booking__catalog">
          @for (lesson of lessons(); track lesson.id) {
            <li>
              <strong>{{ lesson.title }}</strong>
              <span>{{ lesson.level }} · {{ lesson.duration }} min</span>
              <span>{{ '$' + lesson.price }} · Coach {{ lesson.coach }}</span>
            </li>
          }
        </ul>

        @if (submitted()) {
          <p class="lesson-booking__thanks" role="status">
            {{ confirmation() }}
          </p>
        } @else {
          <form class="lesson-booking__form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <label>
              Lesson
              <select formControlName="lessonId">
                <option value="">Select a lesson</option>
                @for (lesson of lessons(); track lesson.id) {
                  <option [value]="lesson.id">{{ lesson.title }} ({{ lesson.level }})</option>
                }
              </select>
            </label>
            <label>
              Name
              <input type="text" formControlName="name" autocomplete="name" />
            </label>
            <label>
              Email
              <input type="email" formControlName="email" autocomplete="email" />
            </label>
            <label>
              Preferred date
              <input type="date" formControlName="date" />
            </label>
            <label>
              Notes
              <textarea formControlName="notes" rows="3"></textarea>
            </label>
            <button type="submit" [disabled]="form.invalid">
              {{ 'lessons.bookNow' | translate }}
            </button>
            @if (form.touched && form.invalid) {
              <p class="lesson-booking__error">Name, email, lesson, and date are required.</p>
            }
          </form>
        }
      </div>
    </section>
  `,
})
export class LessonBookingComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly submitted = signal(false);
  readonly confirmation = signal('');

  readonly form = new FormGroup({
    lessonId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
  });

  readonly headingField = computed(() => (this.fields() as LessonBookingFields).Heading);
  readonly introField = computed(() => (this.fields() as LessonBookingFields).Intro);
  readonly lessons = computed(() => {
    const parsed = parseJsonArray<Lesson>(
      sitecoreFieldValue((this.fields() as LessonBookingFields).LessonsJson)
    );
    return parsed.length ? parsed : FALLBACK_LESSONS;
  });
  readonly componentClass = computed(() =>
    sxaComponentClass('component lesson-booking', this.params())
  );
  readonly renderingId = computed(() => sxaRenderingId(this.params()));

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const lesson = this.lessons().find((item) => item.id === value.lessonId);
    this.confirmation.set(
      `Request sent for ${lesson?.title ?? 'your lesson'}. We will email ${value.email}.`
    );
    this.submitted.set(true);
  }
}

export default LessonBookingComponent;
export { LessonBookingComponent as Default };
export { LessonBookingComponent as LessonBooking };
export { LessonBookingComponent as CSSStyles };
