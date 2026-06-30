import { Component, ComponentRef, inject, OnInit, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from "../../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";

@Component({
  selector: 'app-ingreso',
  imports: [PageLayout, ButtonGroup, Button, Icon],
  templateUrl: './ingreso.html',
  styleUrl: './ingreso.css',
})
export class Ingreso implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/ingreso-list/ingreso-list').then((m) => {
      const ref = this.container().createComponent(m.IngresoList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });

      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
