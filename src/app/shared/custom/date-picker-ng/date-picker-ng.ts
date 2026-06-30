import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { DatePicker } from "primeng/datepicker";
import { Message } from "primeng/message";

@Component({
  selector: 'app-date-picker-ng',
  imports: [DatePicker, Message, FormsModule],
  template: `<div class="flex flex-col gap-1">
    <label
      [for]="name()"
      class="text-sm ms-2"
      [class.text-red-400]="required() && invalid() && touched()"
      >{{ label() }}</label
    >
    <p-datepicker
      [(ngModel)]="value"
      [invalid]="invalid()"
      (onBlur)="touched.set(true)"
      [disabled]="disabled()"
      [inputId]="name()"
      [dateFormat]="dateFormat()"
      [showIcon]="showIcon()"
      [iconDisplay]="'input'"
      [showTime]="showTime()"
      [hourFormat]="hourFormat()"
      [timeOnly]="timeOnly()"
      [showClear]="showClear()"
      [autofocus]="autoFocus()"
      appendTo="body"
      fluid
    />
    @if (invalid() && touched()) {
      @for (error of errors(); track error) {
        <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
      }
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerNg implements FormValueControl<Date> {
  // Required
  value = model<Date>(new Date());

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

  dateFormat = input<string>('dd/mm/yy');
  showIcon = input<boolean>(true);
  showTime = input<boolean>(false);
  showClear = input<boolean>(false);
  hourFormat = input<'12' | '24'>('24');
  timeOnly = input<boolean>(false);
}
