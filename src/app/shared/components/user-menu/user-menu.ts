import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Icon } from '../icon/icon';
import { Menu } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { DeviceService } from '../../../core/services/device.service';

@Component({
  selector: 'app-user-menu',
  imports: [Button, Icon, Menu],
  template: ` <div>
    <p-menu #menu [popup]="true" [model]="items" appendTo="body"> </p-menu>
    <p-button styleClass="p-0! my-2! rounded-none!" text (click)="menu.toggle($event)">
      <app-icon name="LucideCircleUserRound" [size]="32" />
      @if (!device.isMobile()) {
        <div class="flex flex-col text-start">
          <span class="text-sm font-semibold text-muted-color-emphasis">{{
            auth.user()?.name
          }}</span>
          <span class="text-sm text-muted-color">{{ auth.user()?.email }}</span>
        </div>
      }
    </p-button>
  </div>`,
})
export class UserMenu {
  auth = inject(AuthService);
  device = inject(DeviceService);

  protected ref?: DynamicDialogRef | null;
  protected dialogService = inject(DialogService);

  items: MenuItem[] = [
    { label: 'Perfil', icon: 'pi pi-user' },
    {
      label: 'Cambiar contraseña',
      icon: 'pi pi-lock',
      command: () => {
        import('../../../features/account/change-password/change-password').then((m) => {
          this.ref = this.dialogService.open(m.ChangePassword, {
            header: 'Cambiar contraseña',
            modal: true,
            width: '400px',
            breakpoints: { '400px': '95vw' },
          });
        });
      },
    },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.auth.logout() },
  ];
}
