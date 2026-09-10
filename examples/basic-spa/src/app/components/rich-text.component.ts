import { Component, computed, input } from '@angular/core';
import {
  ComponentRendering,
  ScRichTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { sxaComponentClass, sxaRenderingId, type SxaParams } from './sxa-params';

interface RichTextFields {
  Text?: TextField;
}

@Component({
  selector: 'app-rich-text',
  imports: [ScRichTextDirective],
  template: `
    <div class="{{ componentClass() }}" [attr.id]="renderingId()">
      <div class="component-content">
        @if (textField()) {
          <div *scRichText="textField()"></div>
        } @else {
          <span class="is-empty-hint">Rich text</span>
        }
      </div>
    </div>
  `,
})
export class RichTextComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<SxaParams>({});
  readonly rendering = input<ComponentRendering>();

  readonly textField = computed(() => (this.fields() as RichTextFields).Text);
  readonly componentClass = computed(() => sxaComponentClass('component rich-text', this.params()));
  readonly renderingId = computed(() => sxaRenderingId(this.params()));
}

export default RichTextComponent;
export { RichTextComponent as Default };
