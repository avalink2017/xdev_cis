import { Component, inject, inputBinding, model, signal, viewChild, ViewContainerRef } from '@angular/core';
import { urlUser } from '../../../../../core/services/endpoint.service';
import { UserDTO, UserListDTO } from '../user.model.dto';
import { ConfirmationService } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Actives } from '../../../../../core/model/shared.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [TableView, TableColumn, Select, Drawer, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);  

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');

  actives = Actives;  
  showDrawer = signal(false);
  drawerTitle = signal<string>('');

  url = `${urlUser}/paged`;

  ngOnInit(): void {
    
  }

  onRowClick(row: rowData<UserListDTO>) {
    this.drawerTitle.set('Modificar Cuenta de Usuario');
    this.showDrawer.set(true);
    this.createComponent(row.id);
  }

  onAddNew() {
    this.drawerTitle.set('Crear Cuenta de Usuario');
    this.showDrawer.set(true);
    this.createComponent(null);
  }

  onDelete(row: UserDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el usuario ${row.name ?? ''}?`,
      header: `Eliminar Cuenta de Usuario`,
      closable: true,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'contrast',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: '¡Si, Eliminar!',
        size: 'small',
        styleClass: 'ml-2!',
        severity: 'danger',
      },
      accept: () => {
        this.api.delete(`${urlUser}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }

  createComponent(entityId: string | null) {
    this.container().clear();
    import('../user-form/user-form').then((m) => {
      const ref = this.container().createComponent(m.UserForm, {
        bindings: [inputBinding('entityId', () => entityId)],
      });
      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res);
        this.drawerRef().close(new Event('close'));
      });
    });
  }
}
