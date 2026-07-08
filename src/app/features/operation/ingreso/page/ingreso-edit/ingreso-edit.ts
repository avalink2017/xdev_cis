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
import { Menu } from "primeng/menu";

@Component({
  selector: 'app-ingreso-edit',
  imports: [PageLayout, Button, Icon, BackButton, Card, Menu],
  templateUrl: './ingreso-edit.html',
  styleUrl: './ingreso-edit.css',
})
export class IngresoEdit implements OnInit {
  inid = input<string | undefined>(undefined);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.isFormValid());
  isNew = computed(() => this.formRef()?.instance.isNew());
  statusId = computed(() => this.formRef()?.instance.statusId());

  items = computed<MenuItem[]>(() => [
    {
      label: 'Guardar',
      icon: 'pi pi-cloud',
      visible: this.statusId() === 'draft',
      disabled: !this.isFormValid(),
      command: () => this.onSave(),
    },
    {
      label: 'Imprimir',
      icon: 'pi pi-print',
      visible: this.statusId() === 'confirmed',
      command: () => this.onPrint(),
    },
    {
      label: 'Descargar',
      icon: 'pi pi-download',
      visible: this.statusId() === 'confirmed',
      command: () => this.onDownload(),
    },
    {
      label: 'Confirmar',
      icon: 'pi pi-check-circle',
      visible: this.statusId() === 'draft' && !this.isNew(),
      command: () => this.onConfirm(),
    },
    {
      label: 'Anular',
      icon: 'pi pi-times',
      visible: this.statusId() !== 'canceled' && !this.isNew(),
      command: () => this.onCancel(),
    },
  ]);

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

  onCancel() {
    this.formRef()?.instance.cancel();
  }

  onConfirm() {
    this.formRef()?.instance.confirm();
  }
}
