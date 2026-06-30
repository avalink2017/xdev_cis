import { Component, ComponentRef, inject, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from "../../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";

@Component({
  selector: 'app-egreso',
  imports: [PageLayout, ButtonGroup, Button, Icon],
  templateUrl: './egreso.html',
  styleUrl: './egreso.css',
})
export class Egreso {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/egreso-list/egreso-list').then((m) => {
      const ref = this.container().createComponent(m.EgresoList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });

      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
