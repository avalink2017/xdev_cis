import { Component, effect, inject, input } from '@angular/core';
import { DeviceService } from '../../../core/services/device.service';
import { Location } from '@angular/common';
import { Button } from "primeng/button";
import { Icon } from "../../components/icon/icon";

@Component({
  selector: 'app-back-button',
  imports: [Button, Icon],
  standalone: true,
  template: `<div>
    <p-button
      severity="secondary"
      title="Regresar"
      [size]="size()"
      pTooltip="Regresar"
      tooltipPosition="left"
      [label]="label()"
      (onClick)="location.back()"
    >
      <app-icon name="LucideUndo2" />
    </p-button>
  </div>`,
})
export class BackButton {
  device = inject(DeviceService);
  location = inject(Location);
  size = input<'small' | 'large' | undefined>(undefined);
  back = input<boolean>(false);
  label = input<string | undefined>(undefined);

  constructor() {
    effect(() => {
      if (this.back()) {
        this.location.back();
      }
    });
  }

  isMobile = this.device.isMobile;
}
