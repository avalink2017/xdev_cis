import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { InputText } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { Message } from 'primeng/message';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-input-ng',
  imports: [InputText, Message, AutoFocusModule, InputMaskModule],
  template: `
    <div class="flex flex-col gap-1">
      <label
        [for]="name()"
        class="text-sm ms-2"
        [class.text-red-400]="required() && invalid() && touched()"
        >{{ label() }}</label
      >
      <input
        pInputText
        [id]="name()"
        [type]="type()"
        [value]="value()"
        (input)="value.set($event.target.value)"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="invalid()"
        [attr.aria-invalid]="invalid()"
        (blur)="touched.set(true)"
        [pAutoFocus]="autoFocus()"
        [pInputMask]="inputMask()"
        [placeholder]="placeHolder()"
      />
      @if (invalid() && touched()) {
        @for (error of errors(); track error) {
          <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNg implements FormValueControl<string> {
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
  inputMask = input<string | undefined>(undefined);
  placeHolder = input<string>('');
}
