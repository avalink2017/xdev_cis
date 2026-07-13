import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { InputNumber } from "primeng/inputnumber";
import { Message } from "primeng/message";

@Component({
  selector: 'app-input-number-ng',
  imports: [InputNumber, FormsModule, Message],
  template: `
    <div class="flex flex-col gap-1">
      <label
        [for]="name()"
        class="text-sm ms-2"
        [class.text-red-400]="required() && invalid() && touched()"
        >{{ label() }}</label
      >
      <p-inputnumber
        #inng
        [inputId]="name()"
        [(ngModel)]="value"
        [size]="size()"
        [invalid]="invalid()"
        (onBlur)="touched.set(true)"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()"
        [minFractionDigits]="minFractionDigits()"
        [maxFractionDigits]="maxFractionDigits()"
        fluid
        [showClear]="showClear()"
        (onFocus)="inng.input.nativeElement.select()"
        [showButtons]="showButtons()"
        [useGrouping]="useGrouping()"
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
export class InputNumberNg implements FormValueControl<number> {
  // Required
  value = model<number>(0);

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

  label = input<string>();
  autoFocus = input<boolean>(false);
  size = input<'small' | 'large' | undefined>(undefined);
  showClear = input(false);
  showButtons = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  minFractionDigits = input<number>(0);
  maxFractionDigits = input<number>(0);
  useGrouping = input(true);
}
