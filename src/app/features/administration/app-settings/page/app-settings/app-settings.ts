import { Component, ComponentRef, computed, inject, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from "../../../../../shared/components/page-layout/page-layout";
import { ButtonGroup } from "primeng/buttongroup";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { Card } from "primeng/card";

@Component({
  selector: 'app-app-settings',
  imports: [PageLayout, ButtonGroup, Button, Icon, Card],
  templateUrl: './app-settings.html',
  styleUrl: './app-settings.css',
})
export class AppSettings {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);
  isFormValid = computed(() => this.formRef()?.instance.isFormValid());

  createComponent() {
    import('../../component/app-settings-form/app-settings-form').then((m) => {
      const ref = this.container().createComponent(m.AppSettingsForm);

      this.formRef.set(ref);
    });
  }

  Save() {
    this.formRef()?.instance.onSubmit();
  }
}
