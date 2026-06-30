import {
  Component,
  inject,
  inputBinding,
  model,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from '../../../../../shared/components/table/table-column/table-column';
import { urlCuentaBanco } from '../../../../../core/services/endpoint.service';
import { CuentaBancoDTO, CuentaBancoListDTO, TIPO_CUENTA_OPTIONS } from '../bank-account.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { Select } from 'primeng/select';
import { Actives } from '../../../../../core/model/shared,model.dto';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { BankAccountService } from '../services/bank.account.service';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-bank-account-list',
  imports: [TableView, TableColumn, Select, FormsModule, DatePicker, Drawer],
  templateUrl: './bank-account-list.html',
  styleUrl: './bank-account-list.css',
  providers: [BankAccountService],
})
export class BankAccountList implements OnInit {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);
  bankService = inject(BankAccountService);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');

  actives = Actives;
  tipoCuentaOptions = TIPO_CUENTA_OPTIONS;
  showDrawer = signal(false);
  drawerTitle = signal<string>('Crear Cuenta de Banco');

  url = `${urlCuentaBanco}/paged`;

  ngOnInit(): void {
    this.bankService.getData();
  }

  onRowClick(row: rowData<CuentaBancoListDTO>) {
    this.drawerTitle.set('Modificar Cuenta de Banco');
    this.showDrawer.set(true);
    this.createComponent(row.id);
  }

  onAddNew() {
    this.drawerTitle.set('Crear Cuenta de Banco')
    this.showDrawer.set(true);
    this.createComponent(null);
  }

  onDelete(row: CuentaBancoDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar la Cuenta Bancaria ${row.nombre ?? ''}?`,
      header: `Eliminar Cuenta Bancaria`,
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
        this.api.delete(`${urlCuentaBanco}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }

  createComponent(entityId: string|null) {
    this.container().clear();
    import('../bank-account-form/bank-account-form').then((m) => {
      const ref = this.container().createComponent(m.BankAccountForm, {
        bindings: [inputBinding('entityId', () => entityId)],
      });
      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res)
        this.drawerRef().close(new Event('close'));
      });
    });
  }
}
