import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormCheckboxControl } from '@angular/forms/signals';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-check-ng',
  imports: [FormsModule, Checkbox],
  template: `<div class="flex h-full">
    <div class="flex gap-2 my-auto">
      <p-checkbox [inputId]="name()" [(ngModel)]="checked" [binary]="true" />
      <label [for]="name()">{{ label() }}</label>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckNg implements FormCheckboxControl {
  checked = model<boolean>(false);

  name = input<string>('');
  label = input<string>('');
}
