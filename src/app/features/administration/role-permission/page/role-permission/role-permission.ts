import { Component, ComponentRef, inject, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { Icon } from "../../../../../shared/components/icon/icon";

@Component({
  selector: 'app-role-permission',
  imports: [Icon],
  templateUrl: './role-permission.html',
  styleUrl: './role-permission.css',
})
export class RolePermission {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/role-permission-view/role-permission-view').then((m) => {
      const ref = this.container().createComponent(m.RolePermissionView, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      });

      this.formRef.set(ref);
    });
  }

  AddNew() {
    this.formRef()?.instance.onAddNew();
  }
}
