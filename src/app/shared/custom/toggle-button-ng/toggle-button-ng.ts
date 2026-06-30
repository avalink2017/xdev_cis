import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormCheckboxControl } from '@angular/forms/signals';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'app-toggle-button-ng',
  imports: [ToggleButton, FormsModule],
  template: `<div>
    <p-togglebutton
      [(ngModel)]="checked"
      name="replacementRequired"
      [onLabel]="onLabel()"
      [offLabel]="offLabel()"
      [class]="checked() ? 'text-green-600!' : 'text-orange-400!'"
    />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonNg implements FormCheckboxControl {
  checked = model<boolean>(false);
  onLabel = input<string>('');
  offLabel = input<string>('');
}
