import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-select-ng',
  imports: [Select, FormsModule, Message],
  template: `<div class="flex flex-col gap-1">
    <label
      [for]="name()"
      class="text-sm ms-2 font-semibold"
      [class.text-red-400]="required() && invalid() && touched()"
      >{{ label() }}</label
    >
    <p-select
      [inputId]="name()"
      [options]="options()"
      [optionLabel]="optionLabel()"
      [optionValue]="optionValue()"
      [(ngModel)]="value"
      [autofocus]="autoFocus()"
      [disabled]="disabled()"
      (onBlur)="touched.set(true)"
      [showClear]="showClear()"
      [placeholder]="placeholder()"
      [size]="size()"
      [showClear]="showClear()"
      [invalid]="invalid()"
      appendTo="body"
      (onChange)="onChange($event)"
    />
    @if (invalid() && touched()) {
      @for (error of errors(); track error) {
        <p-message severity="error" size="small" variant="simple">{{ error.message }}</p-message>
      }
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectNg implements FormValueControl<string> {
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

  label = input<string>();
  autoFocus = input<boolean>(false);

  options = input<any[] | null>(null, { alias: 'options' });
  optionLabel = input<string>('name');
  optionValue = input<string>('id');
  placeholder = input<string>('');
  size = input<'small' | 'large' | undefined>(undefined);
  showClear = input(false);
  selectChange = output<any>();

  onChange(val: any) {
    if (val && val.value) {
      if (this.options()) {
        var exists = this.options()?.find((f) => f[this.optionValue()] === val.value);
        this.selectChange.emit(exists);
      }
    }
  }
}
