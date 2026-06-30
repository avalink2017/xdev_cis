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

@Component({
  selector: 'app-tipo-ingreso',
  imports: [PageLayout, Button, Icon, ButtonGroup],
  templateUrl: './tipo-ingreso.html',
  styleUrl: './tipo-ingreso.css',
})
export class TipoIngreso implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/tipo-ingreso-list/tipo-ingreso-list').then((m) =>
    {
      const ref = this.container().createComponent(m.TipoIngresoList, {
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
