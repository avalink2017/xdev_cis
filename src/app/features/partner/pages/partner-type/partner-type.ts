import { Component, ComponentRef, inject, OnInit, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../core/services/device.service';
import { PageLayout } from "../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Icon } from "../../../../shared/components/icon/icon";
import { Button } from "primeng/button";

@Component({
  selector: 'app-partner-type',
  imports: [PageLayout, ButtonGroup, Icon, Button],
  templateUrl: './partner-type.html',
  styleUrl: './partner-type.css',
})
export class PartnerType implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/partner-type/partner-type-list/partner-type-list').then((m) => {
      const ref = this.container().createComponent(m.PartnerTypeList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });
      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
