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
  selector: 'app-asset-category',
  imports: [PageLayout, Button, Icon, ButtonGroup, Card],
  templateUrl: './asset-category.html',
  styleUrl: './asset-category.css',
})
export class AssetCategory implements OnInit {
  private container = viewChild.required('compo', { read: ViewContainerRef });
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  device = inject(DeviceService);

  ngOnInit(): void {
    this.createComponent();
  }

  refresh = signal(false);

  createComponent() {
    import('../../components/asset-category-list/asset-category-list').then((m) =>
    {
      const ref = this.container().createComponent(m.AssetCategoryList, {
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
