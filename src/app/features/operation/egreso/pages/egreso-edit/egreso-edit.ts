import { Component, ComponentRef, computed, inject, input, inputBinding, OnInit, signal, viewChild, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from "../../../../../shared/components/page-layout/page-layout";
import { BackButton } from "../../../../../shared/custom/back-button/back-button";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { Card } from "primeng/card";

@Component({
  selector: 'app-egreso-edit',
  imports: [PageLayout, BackButton, Button, Icon, SplitButton, Card],
  templateUrl: './egreso-edit.html',
  styleUrl: './egreso-edit.css',
})
export class EgresoEdit implements OnInit {
  egid = input<string | undefined>(undefined);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.isFormValid());
  isNew = computed(() => this.formRef()?.instance.isNew());

  items: MenuItem[] = [
    {
      label:'Descargar',
      icon:'pi pi-download',
      command:() => this.onDownload()
    }
  ];

  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  createComponent() {
    import('../../components/egreso-form/egreso-form').then((m) => {
      const ref = this.container().createComponent(m.EgresoForm, {
        bindings: [inputBinding('egid', () => this.egid())],
      });

      this.formRef.set(ref);
    });
  }

  onSave() {
    this.formRef()?.instance.onSubmit();
  }

  onPrint() {
    this.formRef()?.instance.print();
  }

  onDownload() {
    this.formRef()?.instance.download();
  }
}
