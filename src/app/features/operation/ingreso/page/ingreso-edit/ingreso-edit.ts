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

@Component({
  selector: 'app-ingreso-edit',
  imports: [PageLayout, Button, Icon, BackButton],
  templateUrl: './ingreso-edit.html',
  styleUrl: './ingreso-edit.css',
})
export class IngresoEdit implements OnInit {
  inid = input<string | undefined>(undefined);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.isFormValid());

  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent()
  }

  createComponent() {
    import('../../components/ingreso-form/ingreso-form').then((m) => {
      const ref = this.container().createComponent(m.IngresoForm, {
        bindings: [inputBinding('inid', () => this.inid())],
      });

      this.formRef.set(ref);
    });
  }

  onSave(){
    this.formRef()?.instance.onSubmit();
  }
}
