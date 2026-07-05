import {
  Component,
  ComponentRef,
  inject,
  OnInit,
  signal,
  twoWayBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { PageLayout } from '../../../../../shared/components/page-layout/page-layout';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ButtonGroup } from 'primeng/buttongroup';
import { DeviceService } from '../../../../../core/services/device.service';
import { Card } from "primeng/card";

@Component({
  selector: 'app-tipo-egreso',
  imports: [PageLayout, Button, Icon, ButtonGroup, Card],
  templateUrl: './tipo-egreso.html',
  styleUrl: './tipo-egreso.css',
})
export class TipoEgreso implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/tipo-egreso-list/tipo-egreso-list').then((m) =>
    {
      const ref = this.container().createComponent(m.TipoEgresoList, {
        bindings: [twoWayBinding('refresh', this.refresh)],
      })

      this.formRef.set(ref)
    }
    );
  }

  AddNew(){
    this.formRef()?.instance.onAddNew();
  }
}
