import {
  Component,
  ComponentRef,
  computed,
  inject,
  input,
  inputBinding,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DeviceService } from '../../../../../core/services/device.service';
import { PageLayout } from '../../../../../shared/components/page-layout/page-layout';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { BackButton } from '../../../../../shared/custom/back-button/back-button';
import { Card } from "primeng/card";
import { SplitButton } from "primeng/splitbutton";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-ingreso-edit',
  imports: [PageLayout, Button, Icon, BackButton, Card, SplitButton],
  templateUrl: './ingreso-edit.html',
  styleUrl: './ingreso-edit.css',
})
export class IngresoEdit implements OnInit {
  inid = input<string | undefined>(undefined);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.isFormValid());
  isNew = computed(() => this.formRef()?.instance.isNew());

  items: MenuItem[] = [
    {
      label: 'Descargar',
      icon: 'pi pi-download',
      command: () => this.onDownload(),
    },
  ];

  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  createComponent() {
    import('../../components/ingreso-form/ingreso-form').then((m) => {
      const ref = this.container().createComponent(m.IngresoForm, {
        bindings: [inputBinding('inid', () => this.inid())],
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
