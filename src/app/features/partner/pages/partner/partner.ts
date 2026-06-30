import { Component, ComponentRef, inject, OnInit, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../core/services/device.service';
import { PageLayout } from "../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Button } from "primeng/button";
import { Icon } from "../../../../shared/components/icon/icon";

@Component({
  selector: 'app-partner',
  imports: [PageLayout, ButtonGroup, Button, Icon],
  templateUrl: './partner.html',
  styleUrl: './partner.css',
})
export class Partner implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/partner/partner-list/partner-list').then((m) => {
      const ref = this.container().createComponent(m.PartnerList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });

      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
