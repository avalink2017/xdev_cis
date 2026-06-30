import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { Message } from "primeng/message";
import { Textarea } from 'primeng/textarea';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-text-area-ng',
  imports: [Message, FormsModule, Textarea, AutoFocusModule],
  template: `
    <div class="flex flex-col gap-1">
      <label
        [for]="name()"
        class="text-sm ms-2"
        [class.text-red-400]="required() && invalid() && touched()"
        >{{ label() }}</label
      >
      <textarea
        pTextarea
        [id]="name()"
        [rows]="rows()"
        [cols]="cols()"
        [(ngModel)]="value"
        [invalid]="invalid()"
        [attr.aria-invalid]="invalid()"
        (blur)="touched.set(true)"
        [pAutoFocus]="autoFocus()"
        [disabled]="disabled()"
        [pSize]="pSizeValue"
        fluid
        autoResize
      ></textarea>

      @if (invalid() && touched()) {
        @for (error of errors(); track error) {
          <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaNg implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  name = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  type = input<string>('text');
  label = input<string>();
  autoFocus = input<boolean>(false);
  rows = input<number>(3);
  cols = input<number | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);

  protected get pSizeValue(): 'small' | 'large' {
    return this.size() as 'small' | 'large';
  }
}
