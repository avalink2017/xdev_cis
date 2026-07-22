import { Component, ComponentRef, inject, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from "../../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { Card } from "primeng/card";

@Component({
  selector: 'app-number-range',
  imports: [PageLayout, ButtonGroup, Button, Icon, Card],
  templateUrl: './number-range.html',
  styleUrl: './number-range.css',
})
export class NumberRange {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/number-range-list/number-range-list').then((m) => {
      const ref = this.container().createComponent(m.NumberRangeList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });

      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
