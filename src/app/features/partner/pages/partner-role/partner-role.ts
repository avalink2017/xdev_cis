import { Component, ComponentRef, inject, OnInit, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../core/services/device.service';
import { PageLayout } from "../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Icon } from "../../../../shared/components/icon/icon";
import { Button } from "primeng/button";
import { Card } from "primeng/card";

@Component({
  selector: 'app-partner-role',
  imports: [PageLayout, ButtonGroup, Icon, Button, Card],
  templateUrl: './partner-role.html',
  styleUrl: './partner-role.css',
})
export class PartnerRole implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/partner-role/partner-role-list/partner-role-list').then((m) => {
      const ref = this.container().createComponent(m.PartnerRoleList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });
      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
